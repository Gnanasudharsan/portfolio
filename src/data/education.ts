import type { Education } from "./types";

export const education: Education[] = [
  {
    id: "northeastern",
    school: "Northeastern University",
    degree: "M.S. Data Analytics Engineering",
    location: "Boston, Massachusetts",
    period: "Graduating Dec 2026",
    gpa: "3.94 / 4.0",
    detail: "College of Engineering. Graduate work across MLOps, data engineering, data management, and visualization.",
    coursework: [
      "Machine Learning Operations",
      "Data Engineering",
      "Data Management for Analytics",
      "Visualization for Analytics",
      "Prompt Engineering for Generative AI",
    ],
  },
  {
    id: "sairam",
    school: "Sri Sairam Engineering College",
    degree: "B.E. Electronics and Communication Engineering",
    location: "Chennai, India",
    period: "Graduated Apr 2024",
    detail: "Embedded systems, signal processing, and communications. Undergraduate research produced 10 IEEE conference papers.",
  },
];
