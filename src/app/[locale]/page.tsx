import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { CTASection } from "@/components/home/CTASection";
import { PartnersCarousel } from "@/components/home/PartnersCarousel";
import { getActivePartners } from "@/lib/partners";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;

  const title =
    locale === "uz"
      ? "MKM Metal — O'zbekistonda metall prokat yetkazib berish"
      : "MKM Metal — Поставки металлопроката в Узбекистане";

  const description =
    locale === "uz"
      ? "100+ turdagi metall prokat, quvur va metall mahsulotlari. GOST, ASTM, DIN standartlari bo'yicha ishonchli yetkazib beruvchi. Toshkent."
      : "Надёжный поставщик металлопроката, труб и металлических изделий в Узбекистане. Более 100 наименований продукции по ГОСТ, ASTM, DIN. Ташкент.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        ru: `${BASE_URL}/ru`,
        uz: `${BASE_URL}/uz`,
        "x-default": `${BASE_URL}/ru`,
      },
    },
    openGraph: {
      url: `${BASE_URL}/${locale}`,
      title,
      description,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const partners = await getActivePartners();

  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      <CategoryGrid locale={locale} dict={dict} />
      <StatsSection dict={dict} />
      <PartnersCarousel
        dict={dict}
        partners={partners.map((p) => ({ id: p.id, logo: p.logo, name: p.name }))}
      />
      <CTASection dict={dict} locale={locale} />
    </>
  );
}
