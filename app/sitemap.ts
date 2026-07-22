import type { MetadataRoute } from "next";

const siteUrl = "https://dental-site-delta.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy", "/consent"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "yearly",
    priority: path === "" ? 1 : 0.3,
  }));
}
