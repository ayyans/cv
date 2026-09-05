import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/content/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeddes.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Full-Stack Developer & Project Manager`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    profile.name,
    "Full-Stack Developer",
    "Project Manager",
    ...profile.focusAreas,
    ...profile.languages,
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${profile.name} — Full-Stack Developer & Project Manager`,
    description: profile.tagline,
    siteName: `${profile.name}.com`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Full-Stack Developer & Project Manager`,
    description: profile.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.roles.join(" · "),
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location,
  },
  knowsLanguage: profile.languages,
  sameAs: profile.socials
    .filter((s) => !s.url.startsWith("mailto:"))
    .map((s) => s.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
