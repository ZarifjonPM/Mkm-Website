// Unique per-category SEO meta (Title/Description/Keywords), RU/UZ.
// Overrides the generic template on /[locale]/catalog/[category].

interface MetaSet { title: string; description: string; keywords: string[]; }

export const categoryMeta: Record<string, { ru: MetaSet; uz: MetaSet }> = {
  "cherniy-metalloprokat": {
    ru: {
      title: "Черный металлопрокат в Ташкенте — балка, швеллер, лист, арматура | MKM Metal",
      description: "Чёрный металлопрокат из углеродистой и низколегированной стали в Ташкенте: сортовой, фасонный и листовой прокат по ГОСТ. Оптовые цены и доставка по Узбекистану от MKM Metal.",
      keywords: ["черный металлопрокат Ташкент", "купить черный металлопрокат", "балка швеллер уголок", "листовой прокат", "арматура", "углеродистая сталь ГОСТ", "металлопрокат оптом Узбекистан", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda qora metall prokat — balka, shveller, list, armatura | MKM Metal",
      description: "Toshkentda uglerodli va kam legirlangan po'latdan qora metall prokat: GOST bo'yicha navli, fasonli va listli prokat. Ulgurji narxlar va O'zbekiston bo'ylab yetkazib berish MKM Metaldan.",
      keywords: ["qora metall prokat Toshkent", "qora metall prokat sotib olish", "balka shveller burchak", "listli prokat", "armatura", "uglerodli po'lat GOST", "metall prokat ulgurji O'zbekiston", "MKM Metal"],
    },
  },
  "nerzhaveyushchiy-metalloprokat": {
    ru: {
      title: "Нержавеющий металлопрокат в Ташкенте — круг, лист, труба, AISI 304 | MKM Metal",
      description: "Нержавеющий металлопрокат в Ташкенте: круг, лист, лента и труба из коррозионностойкой стали AISI 304, 321, 430. Для пищевой и химической отраслей, доставка по Узбекистану.",
      keywords: ["нержавеющий металлопрокат Ташкент", "нержавеющая сталь", "купить нержавейку Узбекистан", "AISI 304 321 430", "коррозионностойкая сталь", "круг лист труба нержавеющая", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda zanglamaydigan metall prokat — doira, list, quvur, AISI 304 | MKM Metal",
      description: "Toshkentda zanglamaydigan metall prokat: AISI 304, 321, 430 korroziyaga chidamli po'latdan doira, list, lenta va quvur. Oziq-ovqat va kimyo sohalari uchun, O'zbekiston bo'ylab yetkazib berish.",
      keywords: ["zanglamaydigan metall prokat Toshkent", "zanglamaydigan po'lat", "zanglamaydigan metall sotib olish O'zbekiston", "AISI 304 321 430", "korroziyaga chidamli po'lat", "doira list quvur zanglamaydigan", "MKM Metal"],
    },
  },
  "trubnaya-produktsiya": {
    ru: {
      title: "Трубы в Ташкенте — стальные бесшовные, электросварные, ВГП | MKM Metal",
      description: "Трубная продукция в Ташкенте: бесшовные, электросварные, профильные и водогазопроводные трубы по ГОСТ. Для нефтегаза, строительства и ЖКХ. Оптом с доставкой по Узбекистану.",
      keywords: ["трубы Ташкент", "купить трубы Узбекистан", "бесшовные трубы", "электросварные трубы", "профильная труба", "водогазопроводные трубы ВГП", "трубы для нефтегаза ГОСТ", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda quvurlar — po'lat choksiz, elektr payvandlangan, VGP | MKM Metal",
      description: "Toshkentda quvur mahsulotlari: GOST bo'yicha choksiz, elektr payvandlangan, profilli va suv-gaz o'tkazuvchi quvurlar. Neft-gaz, qurilish va uy-joy kommunal xo'jaligi uchun. Ulgurji, O'zbekiston bo'ylab yetkazib berish.",
      keywords: ["quvurlar Toshkent", "quvur sotib olish O'zbekiston", "choksiz quvurlar", "elektr payvandlangan quvurlar", "profilli quvur", "suv-gaz o'tkazuvchi quvurlar VGP", "neft-gaz uchun quvurlar GOST", "MKM Metal"],
    },
  },
  "zapornaya-armatura": {
    ru: {
      title: "Запорная арматура в Ташкенте — задвижки, краны, клапаны, фланцы | MKM Metal",
      description: "Запорная арматура и детали трубопровода в Ташкенте: задвижки, шаровые краны, обратные клапаны, фланцы, отводы. Для нефтегаза, водоснабжения и ЖКХ. Доставка по Узбекистану.",
      keywords: ["запорная арматура Ташкент", "трубопроводная арматура", "задвижки краны шаровые", "клапаны обратные", "фланцы отводы", "детали трубопровода", "купить арматуру Узбекистан", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda zaporli armatura — zadvijkalar, kranlar, klapanlar, flanetslar | MKM Metal",
      description: "Toshkentda zaporli armatura va quvur o'tkazgich detallari: zadvijkalar, sharli kranlar, teskari klapanlar, flanetslar, otvodlar. Neft-gaz, suv ta'minoti va uy-joy kommunal xo'jaligi uchun. O'zbekiston bo'ylab yetkazib berish.",
      keywords: ["zaporli armatura Toshkent", "quvur o'tkazgich armaturasi", "zadvijkalar sharli kranlar", "teskari klapanlar", "flanetslar otvodlar", "quvur o'tkazgich detallari", "armatura sotib olish O'zbekiston", "MKM Metal"],
    },
  },
  "kabelnaya-produktsiya": {
    ru: {
      title: "Кабель и провод в Ташкенте — АВВГ, ВВГ, СИП, провод АС | MKM Metal",
      description: "Кабельно-проводниковая продукция в Ташкенте: силовые кабели АВВГ, ВВГ, ВВГнг, провода СИП и АС из меди и алюминия. Для энергоснабжения и ЛЭП, доставка по Узбекистану.",
      keywords: ["кабель Ташкент", "купить провод Узбекистан", "силовой кабель АВВГ ВВГ", "провод СИП", "провод АС", "кабельно-проводниковая продукция", "медный алюминиевый кабель", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda kabel va sim — АВВГ, ВВГ, СИП, АС sim | MKM Metal",
      description: "Toshkentda kabel-sim mahsulotlari: mis va alyuminiydan АВВГ, ВВГ, ВВГнг quvvat kabellari, СИП va АС simlar. Energiya ta'minoti va elektr uzatish liniyalari uchun, O'zbekiston bo'ylab yetkazib berish.",
      keywords: ["kabel Toshkent", "sim sotib olish O'zbekiston", "quvvat kabeli АВВГ ВВГ", "СИП sim", "АС sim", "kabel-sim mahsulotlari", "mis alyuminiy kabel", "MKM Metal"],
    },
  },
  "spetsialnye-stali": {
    ru: {
      title: "Специальные стали и сплавы в Ташкенте — инструментальная, жаропрочная | MKM Metal",
      description: "Специальные стали и сплавы в Ташкенте: легированная, инструментальная, жаропрочная и подшипниковая сталь, чугун, цветные сплавы. Для машиностроения и энергетики. Доставка по Узбекистану.",
      keywords: ["специальные стали Ташкент", "купить спецсталь Узбекистан", "легированная сталь", "инструментальная сталь", "жаропрочная сталь", "чугун цветные сплавы", "марки стали ГОСТ", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda maxsus po'latlar va qotishmalar — asbob, issiqqa chidamli | MKM Metal",
      description: "Toshkentda maxsus po'latlar va qotishmalar: legirlangan, asbob, issiqqa chidamli va podshipnikli po'lat, cho'yan, rangli qotishmalar. Mashinasozlik va energetika uchun. O'zbekiston bo'ylab yetkazib berish.",
      keywords: ["maxsus po'latlar Toshkent", "maxsus po'lat sotib olish O'zbekiston", "legirlangan po'lat", "asbob po'lati", "issiqqa chidamli po'lat", "cho'yan rangli qotishmalar", "po'lat markalari GOST", "MKM Metal"],
    },
  },
  "metallurgicheskoe-syryo": {
    ru: {
      title: "Металлургическое сырьё в Ташкенте — ферросплавы, чушки, огнеупоры | MKM Metal",
      description: "Металлургическое сырьё в Ташкенте: ферросплавы, чушки цветных металлов, баббит, огнеупоры, кокс, руда, металлолом. Для литейного и металлургического производства. Доставка по Узбекистану.",
      keywords: ["металлургическое сырьё Ташкент", "ферросплавы", "чушки алюминиевые бронзовые", "огнеупоры", "кокс металлургический", "железная руда металлолом", "сырьё для литья", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda metallurgiya xomashyosi — ferroqotishmalar, quymalar, o't chidamli materiallar | MKM Metal",
      description: "Toshkentda metallurgiya xomashyosi: ferroqotishmalar, rangli metall quymalari, babbit, o't chidamli materiallar, koks, ruda, metall chiqindilari. Quyish va metallurgiya ishlab chiqarishi uchun. O'zbekiston bo'ylab yetkazib berish.",
      keywords: ["metallurgiya xomashyosi Toshkent", "ferroqotishmalar", "alyuminiy bronza quymalari", "o't chidamli materiallar", "metallurgiya koksi", "temir rudasi metall chiqindilari", "quyish uchun xomashyo", "MKM Metal"],
    },
  },
  "svarochnye-materialy": {
    ru: {
      title: "Сварочные материалы и метизы в Ташкенте — электроды, проволока, крепёж | MKM Metal",
      description: "Сварочные материалы и метизная продукция в Ташкенте: электроды, сварочная проволока, флюсы, болты, гайки, шайбы, шпильки, саморезы. По ГОСТ и DIN, оптом с доставкой по Узбекистану.",
      keywords: ["сварочные материалы Ташкент", "электроды сварочные", "сварочная проволока", "метизы крепёж", "болты гайки шайбы", "шпильки саморезы", "купить метизы Узбекистан", "MKM Metal"],
    },
    uz: {
      title: "Toshkentda payvandlash materiallari va metiz mahsulotlari — elektrodlar, sim, mahkamlagichlar | MKM Metal",
      description: "Toshkentda payvandlash materiallari va metiz mahsulotlari: elektrodlar, payvandlash simi, flyuslar, boltlar, gaykalar, shaybalar, shpilkalar, o'z-o'zidan buraladigan vintlar. GOST va DIN bo'yicha, ulgurji, O'zbekiston bo'ylab yetkazib berish.",
      keywords: ["payvandlash materiallari Toshkent", "payvandlash elektrodlari", "payvandlash simi", "metiz mahsulotlari mahkamlagichlar", "boltlar gaykalar shaybalar", "shpilkalar o'z-o'zidan buraladigan vintlar", "metiz mahsulotlari sotib olish O'zbekiston", "MKM Metal"],
    },
  },
};

export function getCategoryMeta(slug: string, locale: "ru" | "uz"): MetaSet | null {
  return categoryMeta[slug]?.[locale] ?? null;
}
