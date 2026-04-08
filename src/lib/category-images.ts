/** Maps each category slug to an array of product images for card display */
export const categoryImages: Record<string, string[]> = {
  "cherniy-metalloprokat": [
    "/images/catalog/black-metal-0.png",
    "/images/catalog/black-metal-1.png",
    "/images/catalog/black-metal-3.png",
    "/images/catalog/black-metal-5.png",
    "/images/catalog/black-metal-7.png",
    "/images/catalog/black-metal-9.png",
    "/images/catalog/black-metal-11.png",
    "/images/catalog/black-metal-16.png",
    "/images/catalog/black-metal-18.png",
    "/images/catalog/black-metal-22.png",
    "/images/catalog/black-metal-24.png",
    "/images/catalog/black-metal-26.png",
    "/images/catalog/black-metal2-0.png",
    "/images/catalog/black-metal2-2.png",
    "/images/catalog/black-metal2-4.png",
    "/images/catalog/black-metal2-6.png",
    "/images/catalog/black-metal2-8.png",
    "/images/catalog/black-metal2-10.png",
    "/images/catalog/black-metal2-14.png",
    "/images/catalog/black-metal2-17.png",
    "/images/catalog/black-metal2-19.png",
    "/images/catalog/black-metal2-21.png",
  ],
  "nerzhaveyushchiy-metalloprokat": [
    "/images/catalog/stainless-1.png",
    "/images/catalog/stainless-3.png",
    "/images/catalog/stainless-5.png",
    "/images/catalog/stainless-7.png",
    "/images/catalog/stainless-11.png",
    "/images/catalog/stainless-13.png",
    "/images/catalog/stainless-15.png",
  ],
  "trubnaya-produktsiya": [
    "/images/catalog/pipes-1.png",
    "/images/catalog/pipes-3.png",
    "/images/catalog/pipes-5.png",
    "/images/catalog/pipes-7.png",
    "/images/catalog/pipes-11.png",
  ],
  "zapornaya-armatura": [
    "/images/hero/slide-0.png",
    "/images/hero/slide-2.png",
    "/images/hero/slide-4.png",
    "/images/hero/slide-8.png",
    "/images/hero/slide2-0.png",
    "/images/hero/slide2-3.png",
    "/images/hero/slide2-5.png",
  ],
  "kabelnaya-produktsiya": [
    "/images/catalog/cables-1.png",
    "/images/catalog/cables-3.png",
  ],
  "spetsialnye-stali": [
    "/images/catalog/special-steel-0.png",
    "/images/catalog/special-steel-1.png",
    "/images/catalog/special-steel-2.png",
    "/images/catalog/special-steel2-0.png",
    "/images/catalog/special-steel2-1.png",
    "/images/catalog/special-steel2-2.png",
  ],
  "metallurgicheskoe-syryo": [
    "/images/catalog/raw-materials-0.png",
    "/images/catalog/raw-materials-1.png",
    "/images/catalog/raw-materials-2.png",
    "/images/catalog/raw-materials-3.png",
    "/images/catalog/raw-materials-4.png",
  ],
  "svarochnye-materialy": [
    "/images/catalog/welding-0.png",
    "/images/catalog/welding-1.png",
    "/images/catalog/welding-2.png",
    "/images/catalog/welding-3.png",
  ],
};

/** Get an image for a product based on its category and index within that category */
export function getProductImage(categoryId: string, productIndex: number): string {
  const images = categoryImages[categoryId];
  if (!images || images.length === 0) {
    return "/images/catalog/black-metal-0.png"; // fallback
  }
  return images[productIndex % images.length];
}

/** Hero slider images */
export const heroSlides = [
  {
    image: "/images/hero/slide-new-0.jpg",
    alt: { ru: "Труба профильная прямоугольная", uz: "To'g'riburchakli profilli quvur" },
  },
  {
    image: "/images/hero/slide-new-1.jpg",
    alt: { ru: "Металлопрокат", uz: "Metalloprokat" },
  },
  {
    image: "/images/hero/slide-0.png",
    alt: { ru: "Труба профильная квадратная", uz: "Kvadrat profilli quvur" },
  },
  {
    image: "/images/hero/slide-new-2.jpg",
    alt: { ru: "Трубы и фитинги", uz: "Quvurlar va fitinglar" },
  },
  {
    image: "/images/hero/slide-new-4.png",
    alt: { ru: "Труба профильная прямоугольная", uz: "To'g'riburchakli profilli quvur" },
  },
];
