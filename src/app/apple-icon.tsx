import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111" }}>
        <svg width="132" height="132" viewBox="0 0 32 32">
          <path d="M14.2 11.2a5.6 5.6 0 1 0 0 9.6V16h-3.1" fill="none" stroke="#fafafa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m17.2 21.6 3.9-11.2 3.9 11.2M18.6 17.7h5" fill="none" stroke="#fafafa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
