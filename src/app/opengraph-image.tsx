import { ImageResponse } from "next/og";
import { siteConfig } from "@/utils/seo";

export const alt = "Nhlanhla Malaza — Software Developer, DevOps Engineer & NJMTech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #0f2f2e 45%, #134e4a 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#5eead4",
            marginBottom: 24,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Nhlanhla Malaza
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#cbd5e1",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Software Developer · DevOps Engineer · AI Integrations Specialist
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          Johannesburg, South Africa · njmtech.co.za
        </div>
      </div>
    ),
    { ...size },
  );
}
