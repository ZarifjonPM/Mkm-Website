import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Dictionary } from "@/i18n/get-dictionary";

interface PartnersCarouselProps {
  dict: Dictionary;
}

// All partner logos (skip empty: 4, 19)
const logos = Array.from({ length: 34 }, (_, i) => i)
  .filter((i) => i !== 4 && i !== 19)
  .map((i) => `/images/partners-logos/partner-${i}.png`);

export function PartnersCarousel({ dict }: PartnersCarouselProps) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={dict.partners.title} />
      </div>

      <div className="relative mt-8 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        {/* Scrolling track — doubled for seamless loop */}
        <div className="flex animate-scroll">
          {[...logos, ...logos].map((src, i) => (
            <div
              key={i}
              className="mx-4 flex h-16 w-32 flex-shrink-0 items-center justify-center lg:mx-6 lg:h-20 lg:w-40"
            >
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`Partner ${i}`}
                  fill
                  sizes="160px"
                  className="object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
