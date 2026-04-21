import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

const staticRoutes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/catalog", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/partners", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contacts", changeFrequency: "monthly" as const, priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${route.path}`])
          ),
        },
      });
    }
  }

  return entries;
}
