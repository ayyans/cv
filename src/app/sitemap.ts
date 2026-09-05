import type { MetadataRoute } from "next";
import { profile } from "@/content/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeddes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
