import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeToggle } from "@/components/Progress";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "PHYS 10320 · Exam 2 Study Guide", template: "%s · PHYS 10320 Exam 2" },
  description: "Potential, capacitors, circuits, and magnetism: an interactive study guide.",
};

const themeScript = `try{var t=localStorage.getItem("psg-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

const LINKS = [
  { href: "/learn/0", label: "Learn" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/recognizer", label: "Recognizer" },
  { href: "/exams", label: "Practice exams" },
  { href: "/learn/12", label: "Formula sheet" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <header className="no-print sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 px-4 py-2 sm:px-6 md:h-16 md:flex-nowrap md:py-0">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold whitespace-nowrap">
              <span>
                PHYS 10320 <span className="text-muted">· Exam 2</span>
              </span>
            </Link>
            <nav
              aria-label="Main"
              className="order-last -mx-3 flex w-full items-center gap-1 overflow-x-auto text-sm md:order-none md:mx-0 md:ml-auto md:w-auto"
            >
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 whitespace-nowrap text-muted hover:bg-subtle hover:text-fg">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto shrink-0 md:ml-0">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="no-print border-t border-line py-6 text-center text-xs text-muted">
          Your progress is saved in this browser only.
        </footer>
      </body>
    </html>
  );
}
