import { ImageResponse } from "next/og";
import { profile } from "@/content/data";

export const alt = `${profile.name} — ${profile.roles.join(" · ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0b1220 0%, #111827 60%, #0b1220 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          {profile.name}
        </div>
        <div style={{ fontSize: 32, opacity: 0.85, marginBottom: 24 }}>
          {profile.roles.join(" · ")}
        </div>
        <div style={{ fontSize: 20, opacity: 0.6 }}>{profile.tagline}</div>
      </div>
    ),
    { ...size }
  );
}
