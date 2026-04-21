import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteModalProvider } from "@/components/shared/QuoteModalProvider";
import { QuoteModal } from "@/components/shared/QuoteModal";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { ChatWidget } from "@/components/chat/ChatWidget";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
      ? "100+ turdagi metall prokat, quvur va metall mahsulotlari. GOST, ASTM, DIN standartlari bo'yicha ishonchli yetkazib beruvchi."
      : "Надёжный поставщик металлопроката, труб и металлических изделий в Узбекистане. Более 100 наименований. Работаем по ГОСТ, ASTM, DIN.";

  const keywords =
    locale === "uz"
      ? [
          "metall prokat",
          "quvur",
          "MKM Metal",
          "O'zbekiston",
          "armatura",
          "metall yetkazib berish",
        ]
      : [
          "металлопрокат",
          "трубы",
          "MKM Metal",
          "Узбекистан",
          "арматура",
          "поставка металла",
          "металл Ташкент",
        ];

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: "%s | MKM Metal",
    },
    description,
    keywords,
    authors: [{ name: "MKM Metal", url: BASE_URL }],
    creator: "MKM Metal",
    publisher: "MKM Metal",
    openGraph: {
      type: "website",
      locale: locale === "uz" ? "uz_UZ" : "ru_RU",
      alternateLocale: locale === "uz" ? "ru_RU" : "uz_UZ",
      url: `${BASE_URL}/${locale}`,
      siteName: "MKM Metal",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        ru: `${BASE_URL}/ru`,
        uz: `${BASE_URL}/uz`,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MKM Metal",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+998889993838",
      contactType: "sales",
      areaServed: "UZ",
      availableLanguage: ["Russian", "Uzbek"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Темирчи, 19",
    addressLocality: "Ташкент",
    addressCountry: "UZ",
  },
  sameAs: [],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = (params.locale as Locale) || "ru";
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <QuoteModalProvider>
          <Header locale={locale} dict={dict} />
          <main className="min-h-screen">{children}</main>
          <Footer locale={locale} dict={dict} />
          <ChatWidget locale={locale} dict={dict} />
          <QuoteModal dict={dict} />
          <SplashScreen />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
        </QuoteModalProvider>
      </body>
    </html>
  );
}
