import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "Партнеры",
};

// All partner logos (skip empty files: 4 and 19)
const allPartnerLogos = Array.from({ length: 34 }, (_, i) => i)
  .filter((i) => i !== 4 && i !== 19)
  .map((i) => ({
    id: `partner-${i}`,
    src: `/images/partners-logos/partner-${i}.png`,
  }));

export default async function PartnersPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

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
            {allPartnerLogos.map((partner) => (
              <div
                key={partner.id}
                className="flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={partner.src}
                    alt={partner.id}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
