import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/contacts/ContactForm";
import { getSiteSettings, getPhonesArray } from "@/lib/settings";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;

  const title =
    locale === "uz"
      ? "MKM Metal kontaktlari — Toshkentda metall prokat, telefon va manzil | MKM Metal"
      : "Контакты MKM Metal — металлопрокат в Ташкенте, телефоны и адрес | MKM Metal";
  const description =
    locale === "uz"
      ? "MKM Metal kompaniyasi kontaktlari: Toshkent shahri, Temirchi ko'chasi, 19. Telefonlar: +998 88 999 38 38, +998 88 979 79 97. Metall prokat va metallga ishlov berishga buyurtma bering, O'zbekiston bo'ylab yetkazib berish."
      : "Контакты компании MKM Metal: город Ташкент, улица Темирчи, 19. Телефоны: +998 88 999 38 38, +998 88 979 79 97. Заказать металлопрокат и металлообработку с доставкой по Узбекистану.";
  const keywords =
    locale === "uz"
      ? ["MKM Metal kontaktlar", "metall prokat Toshkent telefon", "MKM Metal manzil", "metall sotib olish Toshkent", "metall prokat buyurtma O'zbekiston", "metall bazasi Toshkent"]
      : ["MKM Metal контакты", "металлопрокат Ташкент телефон", "адрес MKM Metal", "купить металл Ташкент", "заказать металлопрокат Узбекистан", "металлобаза Ташкент контакты"];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/contacts`,
      languages: {
        ru: `${BASE_URL}/ru/contacts`,
        uz: `${BASE_URL}/uz/contacts`,
        "x-default": `${BASE_URL}/ru/contacts`,
      },
    },
    openGraph: {
      url: `${BASE_URL}/${locale}/contacts`,
      title,
      description,
    },
  };
}

export default async function ContactsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const settings = await getSiteSettings();
  const phones = getPhonesArray(settings);
  const address = locale === "uz" ? settings.addressUz : settings.addressRu;
  const workingHours = locale === "uz" ? settings.workingHoursUz : settings.workingHoursRu;

  return (
    <>
      <section className="bg-brand py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={dict.contacts.title}
            subtitle={dict.contacts.subtitle}
            light
          />
        </div>
      </section>

      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <div className="space-y-8">
                {/* Phone */}
                {phones.length > 0 && (
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand">{dict.contacts.phone}</h3>
                      {phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="mt-1 block text-gray-600 transition-colors hover:text-accent"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email */}
                {settings.email && (
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand">{dict.contacts.email}</h3>
                      <a
                        href={`mailto:${settings.email}`}
                        className="mt-1 block text-gray-600 transition-colors hover:text-accent"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Address */}
                {address && (
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand">{dict.contacts.address}</h3>
                      <p className="mt-1 text-gray-600">{address}</p>
                      {workingHours && (
                        <p className="mt-1 text-sm text-gray-500">{workingHours}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Map */}
              {settings.mapEmbedUrl && (
                <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
                  <iframe
                    src={settings.mapEmbedUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MKM Metal Office"
                  />
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div id="form" className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
              <h2 className="mb-6 text-xl font-bold text-brand">
                {dict.contacts.formTitle}
              </h2>
              <ContactForm dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
