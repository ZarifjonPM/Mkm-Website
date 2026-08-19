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

  const title =
    locale === "uz"
      ? "MKM Metal hamkorlari — hamkorlik va metall prokat ulgurji yetkazib berish | MKM Metal"
      : "Партнёры MKM Metal — сотрудничество и оптовые поставки металлопроката | MKM Metal";
  const description =
    locale === "uz"
      ? "MKM Metal hamkorlari va mijozlari. Toshkentda va O'zbekiston bo'ylab metall prokat ulgurji yetkazib berish hamda metallga ishlov berish bo'yicha hamkorlikka taklif qilamiz. Dilerlar, pudratchilar va ishlab chiqarishlar uchun qulay shartlar."
      : "Партнёры и клиенты MKM Metal. Приглашаем к сотрудничеству по оптовым поставкам металлопроката и металлообработке в Ташкенте и по Узбекистану. Выгодные условия для дилеров, подрядчиков и производств.";
  const keywords =
    locale === "uz"
      ? ["MKM Metal hamkorlar", "ulgurji metall prokat yetkazib berish", "hamkorlik", "dilerlar uchun", "metall prokat ulgurji Toshkent", "ishlab chiqarish uchun metall", "metall O'zbekiston"]
      : ["партнёры MKM Metal", "оптовые поставки металлопроката", "сотрудничество металлопрокат", "дилерам", "металлопрокат оптом Ташкент", "поставки металла для производств", "металл Узбекистан"];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/partners`,
      languages: {
        ru: `${BASE_URL}/ru/partners`,
        uz: `${BASE_URL}/uz/partners`,
        "x-default": `${BASE_URL}/ru/partners`,
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
