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
  serviceGallery,
} from "@/data/services-content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

const DEFAULT_IMAGE = "/images/catalog/black-metal-0.png";

function galleryOf(slug: string): string[] {
  const g = serviceGallery[slug];
  return g && g.length ? g : [DEFAULT_IMAGE];
}

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
        "x-default": `${BASE_URL}/ru/services/${params.slug}`,
      },
    },
    openGraph: {
      url,
      title: content.seoTitle,
      description: content.seoDescription,
      images: [`${BASE_URL}${galleryOf(params.slug)[0]}`],
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

  const gallery = galleryOf(params.slug);
  const heroImage = gallery[0];
  const introImage = gallery[1] || gallery[0];

  const relatedSlugs = serviceContentSlugs.filter((s) => s !== params.slug);

  const t = {
    services: locale === "uz" ? "Xizmatlar" : "Услуги",
    back: locale === "uz" ? "Barcha xizmatlar" : "Все услуги",
    gallery: locale === "uz" ? "Ishlarimiz" : "Наши работы",
    ctaTitle:
      locale === "uz" ? "Xizmatga buyurtma bermoqchimisiz?" : "Нужна эта услуга?",
    ctaText:
      locale === "uz"
        ? "Chizma yoki tavsifingizni yuboring — narx va muddatni hisoblab beramiz."
        : "Пришлите чертёж или описание — рассчитаем стоимость и сроки.",
    ctaButton: locale === "uz" ? "Zayavka qoldirish" : "Оставить заявку",
    related: locale === "uz" ? "Boshqa xizmatlar" : "Другие услуги",
    more: locale === "uz" ? "Batafsil" : "Подробнее",
  };

  const arrow = (
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
  );

  const check = (
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
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-brand py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-white/60">
            <Link href={`/${locale}/services`} className="hover:text-white">
              {t.services}
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
                    {check}
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/contacts#form`}
                className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
              >
                {t.ctaButton}
              </Link>
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl bg-black/20 lg:h-96">
              <Image
                src={heroImage}
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

      {/* Intro + фото */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="relative order-last h-64 overflow-hidden rounded-2xl bg-gray-100 lg:order-first lg:h-80">
              <Image
                src={introImage}
                alt={content.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="text-lg leading-relaxed text-gray-600">
              {content.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Секции: текст + карточки */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
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
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {section.bullets.map((b) => (
                      <div
                        key={b}
                        className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5 text-base text-gray-700 shadow-sm"
                      >
                        {check}
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Фото-галерея */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-brand sm:text-3xl">
            {t.gallery}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((src, i) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
              >
                <Image
                  src={src}
                  alt={`${content.title} — ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-brand p-8 text-center sm:p-12 lg:p-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">{t.ctaText}</p>
            <Link
              href={`/${locale}/contacts#form`}
              className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
            >
              {t.ctaButton}
            </Link>
          </div>
        </div>
      </section>

      {/* Другие услуги */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-brand sm:text-3xl">
            {t.related}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedSlugs.map((slug) => {
              const related = servicesContent[slug][locale];
              const thumb = galleryOf(slug)[0];
              return (
                <Link
                  key={slug}
                  href={`/${locale}/services/${slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <Image
                      src={thumb}
                      alt={related.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-brand group-hover:text-accent">
                      {related.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {related.subtitle}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-accent">
                      {t.more}
                      {arrow}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <Link
            href={`/${locale}/services`}
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
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
            {t.back}
          </Link>
        </div>
      </section>
    </>
  );
}
