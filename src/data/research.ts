import type { Publication } from "./types";

/**
 * Source of truth: the IEEE Xplore PDFs (venue, ISBN line, and DOI are
 * printed in each paper's first-page footer). Contributions paraphrase
 * each paper's own abstract — no results are added that the paper
 * abstract does not state.
 */

const IC3IOT_22 = "2022 International Conference on Communication, Computing and Internet of Things (IC3IoT)";
const IQ_23 =
  "2023 International Conference on Quantum Technologies, Communications, Computing, Hardware and Embedded Systems Security (iQ-CCHESS)";
const AIKIIE_23 =
  "2023 International Conference on Ambient Intelligence, Knowledge Informatics and Industrial Electronics (AIKIIE)";
const ICCEBS_23 = "2023 Intelligent Computing and Control for Engineering and Business Systems (ICCEBS)";
const IC3IOT_24 = "2024 International Conference on Communication, Computing and Internet of Things (IC3IoT)";

export const publications: Publication[] = [
  {
    id: "hemorrhage-detection",
    title: "Integrating Active Contours and Decision Trees for Systematic Hemorrhage Detection",
    year: 2023,
    date: "Dec 2023",
    venue: ICCEBS_23,
    venueShort: "ICCEBS 2023",
    domain: "Healthcare imaging",
    contribution:
      "A CT-scan pipeline that segments candidate hemorrhage regions with morphological operations, Sobel/marker techniques and watershed segmentation, then classifies them with decision trees.",
    methods: ["Watershed segmentation", "Active contours", "Decision trees", "Image processing"],
    doi: "10.1109/ICCEBS58601.2023.10448726",
    github: "https://github.com/Gnanasudharsan/Hemorrhage_Detection",
    featured: true,
  },
  {
    id: "cardiovascular-prediction",
    title: "Transforming Healthcare with Deep Learning: Cardiovascular Disease Prediction",
    year: 2023,
    date: "Nov 2023",
    venue: AIKIIE_23,
    venueShort: "AIKIIE 2023",
    domain: "Healthcare analytics",
    contribution:
      "Combines a bidirectional LSTM with a CatBoost classifier to estimate, on a statistical level, whether a cardiac condition is likely — aiming to cut slow, costly clinical investigation.",
    methods: ["BiLSTM", "CatBoost", "Clinical tabular data"],
    doi: "10.1109/AIKIIE60097.2023.10390290",
    github: "https://github.com/Gnanasudharsan/Cardiovascular-Disease-Prediction-using-Deep-Learning",
    featured: true,
  },
  {
    id: "secure-auditing",
    title: "Secure Auditing with Encrypted Trace Logs in Multi-Cloud Storage Management",
    year: 2023,
    date: "Nov 2023",
    venue: AIKIIE_23,
    venueShort: "AIKIIE 2023",
    domain: "Cloud security",
    contribution:
      "A unified multi-cloud storage interface whose per-action trace logs are encrypted, so auditing user activity doesn't itself become a sensitive attack surface.",
    methods: ["Multi-cloud storage", "Encryption", "Audit logging"],
    doi: "10.1109/AIKIIE60097.2023.10389994",
    featured: true,
  },
  {
    id: "text-segmentation",
    title: "Text Segmentation and Transliteration Using Deep Learning",
    year: 2023,
    date: "Nov 2023",
    venue: AIKIIE_23,
    venueShort: "AIKIIE 2023",
    domain: "Computer vision",
    contribution:
      "Segments text from natural scene images, passes it through OCR, and transliterates the result — targeting multimedia indexing and assistance for visually impaired users.",
    methods: ["Scene-text segmentation", "OCR", "Deep learning", "Transliteration"],
    doi: "10.1109/AIKIIE60097.2023.10389998",
    github: "https://github.com/Gnanasudharsan/Text-Segmentation-and-Transliteration-Using-Deep-Learning",
  },
  {
    id: "crypto-forecasting",
    title: "Blockchain and Deep Learning-Based Models for Crypto Price Forecasting",
    year: 2023,
    date: "Sep 2023",
    venue: IQ_23,
    venueShort: "iQ-CCHESS 2023",
    domain: "Financial ML",
    contribution:
      "Proposes a LightGBM-based model for forecasting cryptocurrency market movements in real time, where many prior approaches were unsuitable for live use.",
    methods: ["LightGBM", "Time-series forecasting", "Python"],
    doi: "10.1109/iQ-CCHESS56596.2023.10391785",
    github: "https://github.com/Gnanasudharsan/Crypto-Price-Forecasting-using-LGBM-and-Deep-Learning",
  },
  {
    id: "fake-product-detection",
    title: "Fake Product Detection Using Blockchain Using QR Code",
    year: 2023,
    date: "Sep 2023",
    venue: IQ_23,
    venueShort: "iQ-CCHESS 2023",
    domain: "Blockchain",
    contribution:
      "Links each product's QR code to an on-chain record so consumers can verify authenticity — addressing copied-QR attacks that defeat plain QR-based schemes.",
    methods: ["Solidity smart contracts", "QR codes", "Flask", "Supply-chain verification"],
    doi: "10.1109/iQ-CCHESS56596.2023.10391448",
    github: "https://github.com/Gnanasudharsan/Fake-Product-Detection-Using-Blockchain-Using-QR-Code",
  },
  {
    id: "smart-trolley-rssi",
    title: "Smart Trolley with RSSI, OpenCV-Based Navigation and RFID Billing System",
    year: 2024,
    date: "2024",
    venue: IC3IOT_24,
    venueShort: "IC3IoT 2024",
    domain: "Autonomous systems",
    contribution:
      "A self-guiding shopping trolley that follows a shopper via Wi-Fi RSSI, keeps the right person in view with a front camera, and totals items for checkout via RFID.",
    methods: ["Wi-Fi RSSI", "OpenCV person tracking", "RFID", "Raspberry Pi"],
    doi: "10.1109/IC3IoT60841.2024.10550266",
    github: "https://github.com/Gnanasudharsan/Smart-Trolley-Pro",
    featured: true,
  },
  {
    id: "smart-trolley-pro",
    title: "Smart Trolley PRO",
    year: 2023,
    date: "Dec 2023",
    venue: ICCEBS_23,
    venueShort: "ICCEBS 2023",
    domain: "Autonomous systems",
    contribution:
      "An autonomous trolley that trails a shopper by tracking a Wi-Fi tag they carry, uses a person-tracking camera to stay with the correct shopper, and streamlines billing.",
    methods: ["Wi-Fi tag tracking", "Person tracking", "Embedded control"],
    doi: "10.1109/ICCEBS58601.2023.10448714",
  },
  {
    id: "hydroponic-cultivation",
    title: "Intelligently Optimized System for Hydroponic Cultivation",
    year: 2022,
    date: "Mar 2022",
    venue: IC3IOT_22,
    venueShort: "IC3IoT 2022",
    domain: "IoT / agriculture",
    contribution:
      "Sensors and actuators automate a soilless hydroponic system, with per-crop presets that encode ideal growing conditions so the system can steer toward maximum yield.",
    methods: ["Sensors & actuators", "Hydroponics", "Control presets"],
    doi: "10.1109/IC3IOT53935.2022.9767724",
    github: "https://github.com/Gnanasudharsan/Intelligently-Optimized-System-for-Hydroponic-Cultivation",
  },
  {
    id: "smart-attendance",
    title: "Smart Attendance System Using RFID and Face ID",
    year: 2022,
    date: "Mar 2022",
    venue: IC3IOT_22,
    venueShort: "IC3IoT 2022",
    domain: "IoT / identity",
    contribution:
      "Embeds RFID tags in student ID cards with readers in each classroom, paired with face identification, to replace error-prone paper attendance.",
    methods: ["RFID", "Face recognition", "Embedded systems"],
    doi: "10.1109/IC3IOT53935.2022.9768003",
  },
];

export const researchDomains = [
  "Machine learning",
  "Deep learning",
  "Computer vision",
  "Healthcare analytics",
  "Blockchain",
  "IoT",
  "Cloud security",
  "Autonomous systems",
] as const;

export const doiUrl = (doi: string) => `https://doi.org/${doi}`;

export const SCHOLAR_URL = "https://scholar.google.com/citations?user=qJAogF8AAAAJ&hl=en";
