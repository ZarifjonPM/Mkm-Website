import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllCategories, getAllProducts } from "@/lib/catalog";
import { serviceContentSlugs } from "@/data/services-content";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

const staticRoutes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/catalog", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/partners", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contacts", changeFrequency: "monthly" as const, priority: 0.7 },
];

// hreflang alternates (ru, uz, x-default) for a given path suffix
function languagesFor(path: string) {
  const langs: Record<string, string> = {};
  for (const l of locales) langs[l] = `${BASE_URL}/${l}${path}`;
  langs["x-default"] = `${BASE_URL}/ru${path}`;
  return langs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const pushForAllLocales = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number
  ) => {
    const languages = languagesFor(path);
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  };

  // Static routes
  for (const route of staticRoutes) {
    pushForAllLocales(route.path, route.changeFrequency, route.priority);
  }

  // Service detail pages
  for (const slug of serviceContentSlugs) {
    pushForAllLocales(`/services/${slug}`, "monthly", 0.7);
  }

  // Catalog: categories + products (from DB)
  try {
    const [categories, products] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
    ]);

    for (const category of categories) {
      pushForAllLocales(`/catalog/${category.slug}`, "weekly", 0.8);
    }

    for (const product of products) {
      pushForAllLocales(
        `/catalog/${product.categoryId}/${product.id}`,
        "weekly",
        0.7
      );
    }
  } catch {
    // DB unavailable at generation time — still return static + service URLs.
  }

  return entries;
}
