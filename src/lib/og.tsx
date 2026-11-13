import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared OpenGraph card: monogram, eyebrow, title, a measured metric. */
export function ogCard({ eyebrow, title, metric, metricLabel }: { eyebrow: string; title: string; metric?: string; metricLabel?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0a0a0b",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path d="M14.2 11.2a5.6 5.6 0 1 0 0 9.6V16h-3.1" fill="none" stroke="#0a0a0b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m17.2 21.6 3.9-11.2 3.9 11.2M18.6 17.7h5" fill="none" stroke="#0a0a0b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 600 }}>Gnanasudharsan Ashokumar</span>
            <span style={{ fontSize: 20, color: "#a1a1aa" }}>AI/ML & Data Engineer · Boston</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 22, letterSpacing: 2, color: "#7ea4ff", textTransform: "uppercase" }}>{eyebrow}</span>
          <span style={{ fontSize: title.length > 48 ? 58 : 70, fontWeight: 600, lineHeight: 1.04, letterSpacing: -2, maxWidth: 1000 }}>{title}</span>
        </div>
        {metric ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, borderTop: "1px solid #30343c", paddingTop: 26 }}>
            <span style={{ fontSize: 44, fontWeight: 600 }}>{metric}</span>
            <span style={{ fontSize: 24, color: "#a1a1aa" }}>{metricLabel}</span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 28, borderTop: "1px solid #30343c", paddingTop: 26, fontSize: 24, color: "#a1a1aa" }}>
            <span>Agentic AI</span>
            <span>ML systems</span>
            <span>Data platforms</span>
            <span>MLOps</span>
            <span>10 IEEE papers</span>
          </div>
        )}
      </div>
    ),
    ogSize,
  );
}
