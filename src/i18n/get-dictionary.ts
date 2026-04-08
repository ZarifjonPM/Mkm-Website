import type { Locale } from "./config";

const dictionaries = {
  ru: () => import("./ru.json").then((module) => module.default),
  uz: () => import("./uz.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ru"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
};
