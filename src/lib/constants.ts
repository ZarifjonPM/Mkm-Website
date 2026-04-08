export const SITE_NAME = "MKM Metal";
export const SITE_DESCRIPTION_RU = "Поставки металлопроката и трубной продукции в Узбекистане";
export const SITE_DESCRIPTION_UZ = "O'zbekistonda metall prokat va quvur mahsulotlari yetkazib berish";

export const CONTACT = {
  phones: ["+998 88 999 38 38", "+998 88 979 79 97"],
  email: "mkm_metal@mail.ru",
  address: {
    ru: "г. Ташкент, ул. Темирчи, 19",
    uz: "Toshkent sh., Temirchi ko'ch., 19",
  },
} as const;

export const NAV_ITEMS = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/catalog", labelKey: "catalog" },
  { href: "/services", labelKey: "services" },
  { href: "/partners", labelKey: "partners" },
  { href: "/contacts", labelKey: "contacts" },
] as const;
