import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isValidLocale } from "@/i18n/config";
import {
  getServiceContent,
  servicesContent,
  serviceContentSlugs,
} from "@/data/services-content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

// Иллюстрации hero — согласованы с карточками на /services.
const SERVICE_IMAGES: Record<string, string> = {
  coating:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
  laser: "/images/pipeline.jpg",
  turning:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  welding: "/images/oil-gas.jpeg",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80";

export function generateStaticParams() {
  return serviceContentSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const content = isValidLocale(locale)
    ? getServiceContent(params.slug, locale)
    : null;

  if (!content) {
    return { title: locale === "uz" ? "Xizmat topilmadi" : "Услуга не найдена" };
  }

  const url = `${BASE_URL}/${locale}/services/${params.slug}`;

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE_URL}/ru/services/${params.slug}`,
        uz: `${BASE_URL}/uz/services/${params.slug}`,
      },
    },
    openGraph: {
      url,
      title: content.seoTitle,
      description: content.seoDescription,
      images: [SERVICE_IMAGES[params.slug] || DEFAULT_IMAGE],
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;

  if (!isValidLocale(locale)) notFound();

  const content = getServiceContent(params.slug, locale);
  if (!content) notFound();

  const image = SERVICE_IMAGES[params.slug] || DEFAULT_IMAGE;

  const relatedSlugs = serviceContentSlugs.filter((s) => s !== params.slug);
  const backLabel = locale === "uz" ? "Barcha xizmatlar" : "Все услуги";
  const ctaTitle =
    locale === "uz" ? "Xizmatga buyurtma bermoqchimisiz?" : "Нужна эта услуга?";
  const ctaText =
    locale === "uz"
      ? "Chizma yoki tavsifingizni yuboring — narx va muddatni hisoblab beramiz."
      : "Пришлите чертёж или описание — рассчитаем стоимость и сроки.";
  const ctaButton = locale === "uz" ? "Zayavka qoldirish" : "Оставить заявку";
  const relatedTitle = locale === "uz" ? "Boshqa xizmatlar" : "Другие услуги";

  return (
    <>
      {/* Hero */}
      <section className="bg-brand py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-white/60">
            <Link href={`/${locale}/services`} className="hover:text-white">
              {locale === "uz" ? "Xizmatlar" : "Услуги"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{content.title}</span>
          </nav>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {content.title}
              </h1>
              <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
              <p className="mt-5 text-base text-white/70 sm:text-lg">
                {content.subtitle}
              </p>

              <ul className="mt-6 space-y-2">
                {content.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-white/80"
                  >
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/contacts#form`}
                className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
              >
                {ctaButton}
              </Link>
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl bg-black/20 lg:h-80">
              <Image
                src={image}
                alt={content.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-gray-600">
            {content.intro}
          </p>

          <div className="mt-12 space-y-12">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-2xl font-bold text-brand sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-3 h-1 w-12 rounded-full bg-accent" />

                {section.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="mt-4 text-base leading-relaxed text-gray-600"
                  >
                    {p}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-base text-gray-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/services`}
            className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
          >
            <svg
              className="h-4 w-4 rotate-180"
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
            {backLabel}
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-brand p-8 text-center sm:p-12 lg:p-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">{ctaText}</p>
            <Link
              href={`/${locale}/contacts#form`}
              className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
            >
              {ctaButton}
            </Link>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="bg-surface pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-brand sm:text-3xl">
            {relatedTitle}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedSlugs.map((slug) => {
              const related = servicesContent[slug][locale];
              return (
                <Link
                  key={slug}
                  href={`/${locale}/services/${slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                >
                  <h3 className="text-lg font-semibold text-brand group-hover:text-accent">
                    {related.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {related.subtitle}
                  </p>
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
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
