import nextra from "nextra";

const withNextra = nextra({
  latex: true,
  search: { codeblocks: false },
});

// Old URLs from the first version of the site (/learn/<chapter number>).
const LEGACY = [
  "overview", "electric-potential", "capacitors", "current-and-resistance", "dc-circuits",
  "rc-circuits", "biot-savart", "amperes-law", "magnetic-forces", "magnetic-materials",
  "problem-recognizer", "common-mistakes", "formula-sheet", "flashcards", "mixed-practice", "study-plan",
];

export default withNextra({
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async redirects() {
    return [
      ...LEGACY.map((slug, n) => ({ source: `/learn/${n}`, destination: `/${slug}`, permanent: true })),
      { source: "/recognizer", destination: "/problem-recognizer", permanent: true },
      { source: "/exams", destination: "/practice-exams", permanent: true },
    ];
  },
});
