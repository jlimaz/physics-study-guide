// Builds the Pagefind search index from the prerendered HTML that `next build` leaves in .next.
//
// Where that HTML lands depends on the build:
//   - plain `next build`:            .next/server/app/<route>.html
//   - with a deployment adapter      .next/server/route-cache/APP_PAGE/<hash>/$/<route>.html
//     (Vercel builds use one):
// Pointing the Pagefind CLI at .next/server/app only works for the first, and the second would
// give wrong URLs, so this script finds the pages in either layout and adds each one with its
// real URL.
import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import * as pagefind from "pagefind";

const SERVER = path.join(".next", "server");
const OUTPUT = path.join("public", "_pagefind");

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat();
}

// Turns a file path relative to the route root into a URL ("index" -> "/", "a/b" -> "/a/b").
function toUrl(rel) {
  const route = rel.replace(/\.html$/, "").split(path.sep).join("/");
  if (route === "index") return "/";
  return "/" + route.replace(/\/index$/, "");
}

async function findPages() {
  const pages = new Map();

  for (const file of await walk(path.join(SERVER, "app"))) {
    if (file.endsWith(".html")) pages.set(toUrl(path.relative(path.join(SERVER, "app"), file)), file);
  }

  const cacheRoot = path.join(SERVER, "route-cache", "APP_PAGE");
  for (const file of await walk(cacheRoot)) {
    if (!file.endsWith(".html")) continue;
    // <hash>/$/<route>.html
    const parts = path.relative(cacheRoot, file).split(path.sep);
    const marker = parts.indexOf("$");
    if (marker === -1) continue;
    pages.set(toUrl(parts.slice(marker + 1).join(path.sep)), file);
  }

  // Error and not-found pages are not search results.
  for (const url of pages.keys()) {
    if (/^\/_/.test(url) || url === "/404" || url === "/500") pages.delete(url);
  }
  return pages;
}

const pages = await findPages();
if (pages.size === 0) {
  console.error(`pagefind: no prerendered HTML found under ${SERVER}. Did next build run?`);
  process.exit(1);
}

const { index, errors } = await pagefind.createIndex({});
if (!index) throw new Error(`pagefind: could not create index: ${errors.join(", ")}`);

for (const [url, file] of pages) {
  const res = await index.addHTMLFile({ url, content: await readFile(file, "utf8") });
  if (res.errors.length) throw new Error(`pagefind: ${url}: ${res.errors.join(", ")}`);
}

await rm(OUTPUT, { recursive: true, force: true });
const written = await index.writeFiles({ outputPath: OUTPUT });
if (written.errors.length) throw new Error(`pagefind: ${written.errors.join(", ")}`);
await pagefind.close();

console.log(`pagefind: indexed ${pages.size} pages into ${OUTPUT}`);
