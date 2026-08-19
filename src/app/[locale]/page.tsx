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
      ? "Toshkentda metall prokat ulgurji — quvur, armatura, varaq, metall buyumlar | MKM Metal"
      : "Металлопрокат в Ташкенте оптом — трубы, арматура, лист, металлоизделия | MKM Metal";

  const description =
    locale === "uz"
      ? "MKM Metal kompaniyasidan Toshkentda metall prokat, O'zbekiston bo'ylab yetkazib berish bilan. 130 dan ortiq nom: quvur, armatura, varaq, burchak, maxsus po'latlar GOST, ASTM, DIN bo'yicha. Yuqori sifat, hamyonbop narx, tez yetkazib berish."
      : "Купить металлопрокат в Ташкенте с доставкой по Узбекистану от компании MKM Metal. Более 130 наименований: трубы, арматура, листы, уголки, спецстали по ГОСТ, ASTM, DIN. Высокое качество, доступные цены, быстрая доставка.";

  const keywords =
    locale === "uz"
      ? ["metall prokat Toshkent", "metall prokat O'zbekiston", "quvurlar Toshkent", "armatura", "varaq prokat", "metall buyumlar", "ulgurji metall", "maxsus po'latlar", "MKM Metal"]
      : ["металлопрокат Ташкент", "купить металлопрокат Узбекистан", "трубы Ташкент", "арматура Ташкент", "листовой прокат", "металлоизделия", "поставка металла оптом", "спецстали", "MKM Metal"];

  return {
    title: { absolute: title },
    description,
    keywords,
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
