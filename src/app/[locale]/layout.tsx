import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteSettings, getPhonesArray } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteModalProvider } from "@/components/shared/QuoteModalProvider";
import { QuoteModal } from "@/components/shared/QuoteModal";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mkm-metal.uz";

const GA_ID = "G-0LFQJXWEFC";
const YM_ID = 111313317;

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
        "x-default": `${BASE_URL}/ru`,
      },
    },
    verification: {
      google: [
        process.env.GOOGLE_SITE_VERIFICATION,
        "JWTJA4LsCi7zkUirpiXfZ1kjWb2L8nYUFg4M0_2SPjY",
      ].filter((v): v is string => Boolean(v)),
      yandex: "fb96a3a1114219f9",
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

type SettingsShape = Awaited<ReturnType<typeof getSiteSettings>>;

function buildJsonLd(settings: SettingsShape, locale: Locale) {
  const phones = getPhonesArray(settings);
  const telHref = (p: string) => p.replace(/[^\d+]/g, "");
  const address = {
    "@type": "PostalAddress",
    streetAddress: "ул. Темирчи, 19",
    addressLocality: "Ташкент",
    addressRegion: "Ташкент",
    addressCountry: "UZ",
  };
  const sameAs = [
    settings.telegramUrl,
    settings.instagramUrl,
    settings.whatsappUrl,
  ].filter((u) => u && u.trim().length > 0);

  const organization = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "MKM Metal",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    email: settings.email || undefined,
    address,
    contactPoint: phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: telHref(p),
      contactType: "sales",
      areaServed: "UZ",
      availableLanguage: ["Russian", "Uzbek"],
    })),
    ...(sameAs.length ? { sameAs } : {}),
  };

  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    name: "MKM Metal",
    description:
      locale === "uz"
        ? "O'zbekistonda metall prokat, quvur va metall mahsulotlari yetkazib beruvchi."
        : "Поставщик металлопроката, труб и металлических изделий в Узбекистане.",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    image: `${BASE_URL}/images/logo.png`,
    email: settings.email || undefined,
    telephone: phones.length ? telHref(phones[0]) : undefined,
    priceRange: "$$",
    currenciesAccepted: "UZS",
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    address,
    ...(sameAs.length ? { sameAs } : {}),
    parentOrganization: { "@id": `${BASE_URL}/#organization` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, localBusiness],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = (params.locale as Locale) || "ru";
  const dict = await getDictionary(locale);
  const settings = await getSiteSettings();
  const jsonLd = buildJsonLd(settings, locale);

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
        </QuoteModalProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />

        {/* Google Analytics (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>

        {/* Yandex.Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');
ym(${YM_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YM_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
