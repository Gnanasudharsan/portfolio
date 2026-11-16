import type { ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    id: "idw",
    org: "Intelligent DataWorks",
    role: "Data & AI Engineer Co-op",
    location: "Boston, MA",
    start: "Jan 2026",
    end: "Aug 2026",
    kind: "primary",
    summary:
      "Shipped production LLM systems for HR and hiring workflows at an early-stage startup — retrieval, structured extraction, scheduling, and the authentication and data layer underneath them.",
    systems: [
      {
        title: "Two production RAG systems",
        body: "An employment-decision compliance checker and a semantic HR knowledge-base assistant on LangChain with a pgvector-backed PostgreSQL store — replacing manual policy lookup with citation-backed answers returned in seconds.",
        tags: ["LangChain", "pgvector", "PostgreSQL"],
        roles: ["ai", "ml", "data-eng"],
      },
      {
        title: "Grounded, attributable answers",
        body: "Citation-backed generation with span-level source attribution; chunk size, overlap and top-k retrieval tuned so generated claims trace to verifiable passages.",
        tags: ["Retrieval tuning", "Citations", "Evaluation"],
        roles: ["ai", "data-sci"],
      },
      {
        title: "LLM-assisted interview scheduling",
        body: "Delivered end to end: candidate–interviewer matching, a multi-step Streamlit workflow, a normalized PostgreSQL schema, and automated RFC 5545 calendar dispatch through AWS SES.",
        tags: ["Streamlit", "PostgreSQL", "AWS SES"],
        roles: ["ai", "data-eng", "analyst"],
      },
      {
        title: "Platform & extraction services",
        body: "LLM skills-gap analysis and structured extraction; extended the FastAPI platform with a pluggable skill registry, Google OAuth 2.0, RS256 JWT authentication, Docker, and Flyway migrations.",
        tags: ["FastAPI", "OAuth 2.0", "JWT", "Flyway", "Docker"],
        roles: ["ai", "mlops", "data-eng"],
      },
    ],
    stack: ["LangChain", "PostgreSQL", "pgvector", "FastAPI", "Streamlit", "AWS", "Docker", "Flyway"],
  },
  {
    id: "flare",
    org: "Flare Innovations",
    role: "Machine Learning Engineer",
    location: "Chennai, India",
    start: "Jan 2022",
    end: "May 2024",
    kind: "primary",
    summary:
      "Built an AI-driven hydroponic farming system at a startup — where computer vision, IoT sensing, embedded control and analytics meet in one closed loop.",
    highlights: [
      { value: "40%", label: "less manual tuning", context: "Model-guided environmental adjustment", kind: "reported" },
      { value: "85–87%", label: "leaf-disease detection accuracy", context: "OpenCV / CNN, pilot trials", kind: "reported" },
      { value: "20%", label: "lower plant loss", context: "Early intervention during pilots", kind: "reported" },
      { value: "60%", label: "faster agronomic decisions", context: "Monitoring + anomaly dashboard", kind: "reported" },
    ],
    bullets: [
      { text: "Integrated IoT sensing with computer-vision stress detection for continuous, model-guided environmental control.", roles: ["ml", "ai"] },
      { text: "Prototyped real-time leaf-disease detection with OpenCV and CNN architectures across diverse vegetation.", roles: ["ml", "data-sci"] },
      { text: "Connected Arduino and Raspberry Pi sensor streams to automated pH, nutrient-flow, temperature and humidity regulation for 24/7 autonomous operation.", roles: ["data-eng", "mlops"] },
      { text: "Built a Python monitoring and anomaly-detection dashboard visualizing environmental-health correlations in real time.", roles: ["analyst", "data-sci"] },
    ],
    stack: ["Python", "OpenCV", "CNNs", "Arduino", "Raspberry Pi", "Dashboards"],
  },
  {
    id: "sairam-ra",
    org: "Sri Sairam Engineering College",
    role: "Research Assistant",
    location: "Chennai, India",
    start: "Undergraduate",
    end: "",
    kind: "earlier",
    summary:
      "Autonomous smart-trolley research: Wi-Fi RSSI following, OpenCV person tracking, RFID billing and Raspberry Pi control — published as two IEEE papers.",
    stack: ["OpenCV", "RFID", "Raspberry Pi", "Wi-Fi RSSI"],
  },
  {
    id: "incubator-ra",
    org: "Sairam Techno Incubator",
    role: "Research Assistant",
    location: "Chennai, India",
    start: "Undergraduate",
    end: "",
    kind: "earlier",
    summary:
      "Autonomous underwater vehicle perception and navigation on NVIDIA Jetson Nano — real-time computer vision and embedded ML for the team that placed 6th globally at SAUVC 2022.",
    stack: ["Jetson Nano", "Computer vision", "Embedded AI", "Robotics"],
  },
];
