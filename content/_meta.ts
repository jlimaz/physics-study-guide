import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    title: "Home",
    theme: { toc: false, breadcrumb: false, pagination: false, timestamp: false },
  },
  overview: "Exam overview",
  "-- chapters": { type: "separator", title: "Chapters" },
  "electric-potential": "1. Electric potential",
  capacitors: "2. Capacitors and dielectrics",
  "current-and-resistance": "3. Current and resistance",
  "dc-circuits": "4. DC circuits",
  "rc-circuits": "5. RC circuits",
  "biot-savart": "6. Biot–Savart law",
  "amperes-law": "7. Ampère's law",
  "magnetic-forces": "8. Magnetic forces",
  "magnetic-materials": "9. Magnetic materials",
  "-- practice": { type: "separator", title: "Practice" },
  "problem-recognizer": "Problem recognizer",
  flashcards: "Flashcards",
  "mixed-practice": "Mixed practice",
  "practice-exams": "Practice exams",
  "-- reference": { type: "separator", title: "Reference" },
  "formula-sheet": "Formula sheet",
  "common-mistakes": "Common mistakes",
  "study-plan": "Study plan",
};

export default meta;
