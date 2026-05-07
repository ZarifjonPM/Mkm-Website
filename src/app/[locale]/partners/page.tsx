import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getActivePartners } from "@/lib/partners";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;

  const title = locale === "uz" ? "Hamkorlar" : "Партнёры";
  const description =
    locale === "uz"
      ? "Bizning hamkorlarimiz — Rossiya, Yevropa va Osiyoning yetakchi metall prokat ishlab chiqaruvchilari. 30+ ishonchli hamkor."
      : "Наши партнёры — ведущие производители металлопроката из России, Европы и Азии. Более 30 надёжных поставщиков.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/partners`,
      languages: {
        ru: `${BASE_URL}/ru/partners`,
        uz: `${BASE_URL}/uz/partners`,
      },
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/partners`,
      title,
      description,
    },
  };
}

export default async function PartnersPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const partners = await getActivePartners();

  return (
    <>
      <section className="bg-brand py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={dict.partners.title}
            subtitle={dict.partners.subtitle}
            light
          />
        </div>
      </section>

      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {partners.map((partner) => {
              const card = (
                <div className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                  <div className="relative h-full w-full">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              );
              if (partner.url) {
                return (
                  <a
                    key={partner.id}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={partner.name}
                  >
                    {card}
                  </a>
                );
              }
              return <div key={partner.id}>{card}</div>;
            })}
            {partners.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12">
                {locale === "uz" ? "Hamkorlar yo'q" : "Партнёров пока нет"}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
