import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllProducts } from "@/lib/catalog";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;

  const title =
    locale === "uz"
      ? "Toshkentda metall prokat katalogi — quvur, armatura, varaq, maxsus po'lat | MKM Metal"
      : "Каталог металлопроката в Ташкенте — трубы, арматура, лист, спецстали | MKM Metal";
  const description =
    locale === "uz"
      ? "MKM Metal metall prokat katalogi: quvurlar, armatura, varaqli va navli prokat, zanglamaydigan po'lat, maxsus po'latlar, metiz va payvandlash materiallari. GOST, ASTM, DIN bo'yicha 130 dan ortiq nom, O'zbekiston bo'ylab yetkazib berish."
      : "Каталог металлопроката MKM Metal: трубы, арматура, листовой и сортовой прокат, нержавейка, спецстали, метизы и сварочные материалы. Более 130 позиций по ГОСТ, ASTM, DIN с доставкой по Узбекистану.";
  const keywords =
    locale === "uz"
      ? ["metall prokat katalogi", "quvur sotib olish Toshkent", "armatura narxi", "varaqli prokat", "zanglamaydigan prokat", "maxsus po'latlar", "metizlar", "payvandlash materiallari", "MKM Metal"]
      : ["каталог металлопроката", "купить трубы Ташкент", "арматура цена", "листовой прокат", "нержавеющий металлопрокат", "спецстали", "метизы", "сварочные материалы", "металлопрокат Узбекистан цена", "MKM Metal"];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/catalog`,
      languages: {
        ru: `${BASE_URL}/ru/catalog`,
        uz: `${BASE_URL}/uz/catalog`,
        "x-default": `${BASE_URL}/ru/catalog`,
      },
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/catalog`,
      title,
      description,
    },
  };
}

export default async function CatalogPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const products = await getAllProducts();

  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={dict.catalog.title} />
        <CatalogClient products={products} locale={locale} dict={dict} />
      </div>
    </section>
  );
}
