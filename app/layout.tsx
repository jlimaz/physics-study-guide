import type { Metadata } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PHYS 10320 · Exam 2 Study Guide", template: "%s · PHYS 10320 Exam 2" },
  description: "Potential, capacitors, circuits, and magnetism: an interactive study guide for PHYS 10320 Exam 2.",
};

const navbar = (
  <Navbar
    logo={
      <span className="font-semibold">
        PHYS 10320 <span className="font-normal opacity-60">· Exam 2</span>
      </span>
    }
  />
);

const footer = <Footer>Quiz answers, checklists and flashcard piles are saved in this browser only.</Footer>;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          editLink={null}
          feedback={{ content: null }}
          copyPageButton={false}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
