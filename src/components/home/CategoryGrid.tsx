import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import categories from "@/data/categories.json";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface CategoryGridProps {
  locale: Locale;
  dict: Dictionary;
}

const categoryPhotos: Record<string, string> = {
  "cherniy-metalloprokat": "/images/catalog/black-metal-0.png",
  "nerzhaveyushchiy-metalloprokat": "/images/catalog/stainless-1.png",
  "trubnaya-produktsiya": "/images/catalog/pipes-1.png",
  "zapornaya-armatura": "/images/hero/slide-0.png",
  "kabelnaya-produktsiya": "/images/catalog/cables-1.png",
  "spetsialnye-stali": "/images/catalog/special-steel-0.png",
  "metallurgicheskoe-syryo": "/images/catalog/raw-materials-0.png",
  "svarochnye-materialy": "/images/catalog/welding-0.png",
};

export function CategoryGrid({ locale, dict }: CategoryGridProps) {
  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={dict.categories.title}
          subtitle={dict.categories.subtitle}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/catalog?category=${cat.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="relative h-40 overflow-hidden bg-gray-100">
                <Image
                  src={categoryPhotos[cat.id] || "/images/catalog/black-metal-0.png"}
                  alt={cat.name[locale as keyof typeof cat.name]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="mb-2 text-base font-semibold text-brand group-hover:text-accent">
                  {cat.name[locale as keyof typeof cat.name]}
                </h3>

                <p className="text-sm text-gray-500">
                  {cat.description[locale as keyof typeof cat.description]}
                </p>

                <div className="mt-4 flex items-center text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  {locale === "ru" ? "Подробнее" : "Batafsil"}
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
