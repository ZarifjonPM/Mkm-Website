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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "MKM Metal — Поставки металлопроката",
    template: "%s | MKM Metal",
  },
  description:
    "MKM Metal — надежный поставщик металлопроката и трубной продукции в Узбекистане",
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
        </QuoteModalProvider>
      </body>
    </html>
  );
}
