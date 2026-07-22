import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getActiveServices } from "@/lib/services";
import { hasServiceContent } from "@/data/services-content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;

  const title = locale === "uz" ? "Xizmatlar" : "Услуги";
  const description =
    locale === "uz"
      ? "Kompleks xizmatlar: metall prokat yetkazib berish, sertifikatlash, buyurtma bo'yicha metall kesish va qayta ishlash."
      : "Комплексные услуги: поставка металлопроката, сертификация продукции, резка и обработка металла под заказ.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/services`,
      languages: {
        ru: `${BASE_URL}/ru/services`,
        uz: `${BASE_URL}/uz/services`,
      },
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/services`,
      title,
      description,
    },
  };
}

const FALLBACK_IMAGES: Record<string, string> = {
  building: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  pipe: "/images/pipeline.jpg",
  certificate: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  flame: "/images/oil-gas.jpeg",
};

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80";

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const services = await getActiveServices();

  return (
    <>
      <section className="bg-brand py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={dict.services.title}
            subtitle={dict.services.subtitle}
            light
          />
        </div>
      </section>

      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service) => {
              const title = locale === "uz" ? service.titleUz : service.titleRu;
              const description = locale === "uz" ? service.descriptionUz : service.descriptionRu;
              const image = service.image || FALLBACK_IMAGES[service.icon] || DEFAULT_FALLBACK;
              const hasDetail = hasServiceContent(service.slug);

              const cardInner = (
                <>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-brand group-hover:text-accent">{title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{description}</p>
                    {hasDetail && (
                      <span className="mt-4 inline-flex items-center text-sm font-medium text-accent">
                        {locale === "uz" ? "Batafsil" : "Подробнее"}
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
                      </span>
                    )}
                  </div>
                </>
              );

              return hasDetail ? (
                <Link
                  key={service.id}
                  href={`/${locale}/services/${service.slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                >
                  {cardInner}
                </Link>
              ) : (
                <div
                  key={service.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  {cardInner}
                </div>
              );
            })}
            {services.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12">
                {locale === "uz" ? "Xizmatlar mavjud emas" : "Услуг пока нет"}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
