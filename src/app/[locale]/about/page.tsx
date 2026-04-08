import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "О компании",
};

const industries = [
  { key: "oilGas" as const, image: "/images/oil-gas.jpeg" },
  { key: "construction" as const, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
  { key: "industrial" as const, image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" },
  { key: "energy" as const, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80" },
];

const standards = [
  { name: "ГОСТ", description: "Государственные стандарты РФ и СНГ" },
  { name: "ASTM", description: "American Society for Testing and Materials" },
  { name: "DIN", description: "Deutsches Institut für Normung" },
  { name: "API", description: "American Petroleum Institute" },
  { name: "ISO", description: "International Organization for Standardization" },
];

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={dict.about.title} light />
          <p className="mx-auto max-w-3xl text-center text-base text-white/70 lg:text-lg">
            {dict.about.description}
          </p>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={dict.about.industriesTitle} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <div
                key={ind.key}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <Image
                    src={ind.image}
                    alt={dict.about.industries[ind.key as keyof typeof dict.about.industries] as string}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-base font-semibold text-brand">
                    {dict.about.industries[ind.key as keyof typeof dict.about.industries]}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {dict.about.industries[`${ind.key}Desc` as keyof typeof dict.about.industries]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={dict.about.standardsTitle} />
          <p className="mx-auto mb-10 max-w-2xl text-center text-gray-500">
            {dict.about.standardsDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {standards.map((std) => (
              <div
                key={std.name}
                className="rounded-xl border border-gray-200 bg-surface px-6 py-4 text-center"
              >
                <div className="text-2xl font-bold text-accent">
                  {std.name}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {std.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
