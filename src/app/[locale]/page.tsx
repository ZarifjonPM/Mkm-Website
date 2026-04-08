import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { CTASection } from "@/components/home/CTASection";
import { PartnersCarousel } from "@/components/home/PartnersCarousel";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      <CategoryGrid locale={locale} dict={dict} />
      <StatsSection dict={dict} />
      <PartnersCarousel dict={dict} />
      <CTASection dict={dict} locale={locale} />
    </>
  );
}
