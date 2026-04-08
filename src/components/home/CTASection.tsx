import Link from "next/link";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

interface CTASectionProps {
  dict: Dictionary;
  locale: Locale;
}

export function CTASection({ dict, locale }: CTASectionProps) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand p-8 text-center sm:p-12 lg:p-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {dict.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            {dict.cta.subtitle}
          </p>
          <Link
            href={`/${locale}/contacts#form`}
            className="mt-8 inline-flex items-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
          >
            {dict.cta.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
