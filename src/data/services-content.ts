import type { Locale } from "@/i18n/config";

/**
 * SEO-контент детальных страниц услуг (/[locale]/services/[slug]).
 *
 * Хранится в репозитории (без изменения БД). Ключи объекта соответствуют
 * полю `slug` модели Service в Prisma. Базовые данные услуги (заголовок,
 * картинка, статус) берутся из БД, а расширенный SEO-текст — отсюда.
 */

export interface ServiceSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ServiceContent {
  /** SEO <title> */
  seoTitle: string;
  /** SEO meta description */
  seoDescription: string;
  /** H1 страницы */
  title: string;
  /** Подзаголовок под H1 (в hero) */
  subtitle: string;
  /** Вводный абзац */
  intro: string;
  /** Смысловые блоки H2/H3 + текст */
  sections: ServiceSection[];
  /** Короткий список ключевых возможностей (буллеты в сайдбаре hero) */
  highlights: string[];
}

export type LocalizedServiceContent = Record<Locale, ServiceContent>;

export const servicesContent: Record<string, LocalizedServiceContent> = {
  coating: {
    ru: {
      seoTitle:
        "Цинкование и порошковая окраска металла в Ташкенте — МКМ",
      seoDescription:
        "Горячее и холодное цинкование, порошковая и жидкая окраска металлоконструкций в Ташкенте. Защита от коррозии, любой цвет RAL, доставка по Узбекистану от компании МКМ.",
      title: "Цинкование и окраска металла",
      subtitle:
        "Антикоррозийная защита металлоконструкций: горячее цинкование и порошковая окраска в Ташкенте",
      intro:
        "Цинкование и окраска — это защитная обработка металла, которая продлевает срок службы конструкций в несколько раз. Компания МКМ выполняет полный цикл антикоррозийной защиты в Ташкенте: от подготовки поверхности до финишного покрытия нужного цвета. Обрабатываем металлопрокат, металлоконструкции, крепёж и готовые изделия любой сложности.",
      sections: [
        {
          heading: "Виды цинкования металла",
          paragraphs: [
            "Горячее цинкование — погружение изделия в расплав цинка при температуре около 450 °C. Такое покрытие обеспечивает максимальную защиту от коррозии на 25–50 лет и подходит для конструкций, работающих на улице и в агрессивной среде.",
            "Холодное (гальваническое) цинкование применяется для крепежа и мелких деталей, где важна точность размеров и ровный слой. Мы подбираем технологию под условия эксплуатации вашего изделия.",
          ],
        },
        {
          heading: "Порошковая и жидкая окраска",
          paragraphs: [
            "Порошковая окраска создаёт прочное, устойчивое к ударам и ультрафиолету покрытие. Доступен любой цвет по каталогу RAL, а также матовые, глянцевые и структурные фактуры.",
            "Жидкая окраска используется для крупногабаритных конструкций и объектов, которые нельзя поместить в печь полимеризации. Перед окраской обязательно проводим пескоструйную очистку и грунтование.",
          ],
        },
        {
          heading: "Где применяется",
          bullets: [
            "Металлоконструкции для строительства и промышленности",
            "Ограждения, ворота, заборы, перила и лестницы",
            "Опоры, мачты, кронштейны и закладные детали",
            "Оборудование и металлоизделия для нефтегаза и энергетики",
          ],
        },
        {
          heading: "Почему заказывают в МКМ",
          paragraphs: [
            "Мы контролируем качество на каждом этапе: подготовка поверхности, толщина покрытия и адгезия проверяются перед выдачей. Работаем как с единичными изделиями, так и с крупными партиями, соблюдаем сроки и организуем доставку по всему Узбекистану.",
          ],
        },
      ],
      highlights: [
        "Горячее и холодное цинкование",
        "Порошковая окраска в любой цвет RAL",
        "Пескоструйная подготовка поверхности",
        "Доставка по Узбекистану",
      ],
    },
    uz: {
      seoTitle:
        "Toshkentda metallni sinklash va kukunli bo'yash — MKM",
      seoDescription:
        "Toshkentda metall konstruksiyalarni issiq va sovuq sinklash, kukunli va suyuq bo'yash. Korroziyadan himoya, istalgan RAL rangi, O'zbekiston bo'ylab yetkazib berish — MKM kompaniyasi.",
      title: "Metallni sinklash va bo'yash",
      subtitle:
        "Metall konstruksiyalarni korroziyadan himoya qilish: Toshkentda issiq sinklash va kukunli bo'yash",
      intro:
        "Sinklash va bo'yash — bu metallning xizmat muddatini bir necha barobar oshiradigan himoya ishlovi. MKM kompaniyasi Toshkentda korroziyadan himoyaning to'liq siklini bajaradi: sirtni tayyorlashdan tortib kerakli rangdagi yakuniy qoplamagacha. Har qanday murakkablikdagi metall prokat, metall konstruksiya, mahkamlagich va tayyor mahsulotlarni qayta ishlaymiz.",
      sections: [
        {
          heading: "Metallni sinklash turlari",
          paragraphs: [
            "Issiq sinklash — buyumni taxminan 450 °C haroratdagi erigan sinkka botirish. Bunday qoplama 25–50 yilga korroziyadan maksimal himoya beradi va ochiq havoda hamda tajovuzkor muhitda ishlaydigan konstruksiyalar uchun mos keladi.",
            "Sovuq (galvanik) sinklash mahkamlagich va mayda detallar uchun qo'llaniladi, bu yerda o'lchov aniqligi va tekis qatlam muhim. Biz texnologiyani buyumingizning ish sharoitiga qarab tanlaymiz.",
          ],
        },
        {
          heading: "Kukunli va suyuq bo'yash",
          paragraphs: [
            "Kukunli bo'yash zarba va ultrabinafsha nurlarga chidamli mustahkam qoplama hosil qiladi. RAL katalogi bo'yicha istalgan rang, shuningdek mat, yaltiroq va strukturaviy yuzalar mavjud.",
            "Suyuq bo'yash yirik gabaritli konstruksiyalar va polimerlash pechiga sig'maydigan obyektlar uchun ishlatiladi. Bo'yashdan oldin albatta qumpurkash tozalash va gruntlash o'tkazamiz.",
          ],
        },
        {
          heading: "Qayerda qo'llaniladi",
          bullets: [
            "Qurilish va sanoat uchun metall konstruksiyalar",
            "To'siqlar, darvozalar, panjaralar, panjara va zinapoyalar",
            "Tayanchlar, machtalar, kronshteynlar va o'rnatma detallar",
            "Neft-gaz va energetika uchun uskuna va metall buyumlar",
          ],
        },
        {
          heading: "Nega MKM'dan buyurtma berishadi",
          paragraphs: [
            "Biz har bosqichda sifatni nazorat qilamiz: sirtni tayyorlash, qoplama qalinligi va adgeziya buyum berilishidan oldin tekshiriladi. Ham yakka buyumlar, ham yirik partiyalar bilan ishlaymiz, muddatlarga rioya qilamiz va O'zbekiston bo'ylab yetkazib berishni tashkil qilamiz.",
          ],
        },
      ],
      highlights: [
        "Issiq va sovuq sinklash",
        "Istalgan RAL rangida kukunli bo'yash",
        "Sirtni qumpurkash bilan tayyorlash",
        "O'zbekiston bo'ylab yetkazib berish",
      ],
    },
  },

  laser: {
    ru: {
      seoTitle:
        "Лазерная резка, гибка и перфорирование металла в Ташкенте — МКМ",
      seoDescription:
        "Лазерная резка листового металла, гибка на ЧПУ и перфорирование в Ташкенте. Высокая точность, резка стали, нержавейки и алюминия по чертежам. Изготовление от МКМ, доставка по Узбекистану.",
      title: "Лазерная резка, гибка, перфорирование",
      subtitle:
        "Точная обработка листового металла на ЧПУ-оборудовании в Ташкенте",
      intro:
        "Лазерная резка — это высокоточный раскрой листового металла лазерным лучом по цифровому чертежу. Компания МКМ выполняет лазерную резку, гибку и перфорирование металла в Ташкенте на современном оборудовании с ЧПУ. Изготавливаем детали и заготовки по вашим чертежам с точностью до десятых долей миллиметра.",
      sections: [
        {
          heading: "Лазерная резка металла",
          paragraphs: [
            "Режем углеродистую и нержавеющую сталь, алюминий, оцинкованный лист и другие металлы толщиной от 0,5 до 20 мм. Лазер даёт чистый рез без заусенцев и деформации кромки, поэтому детали не требуют дополнительной обработки.",
            "Работаем по файлам в форматах DXF, DWG и других — от единичной детали до серийного производства. Раскрой оптимизируется под лист, что снижает расход металла и стоимость заказа.",
          ],
        },
        {
          heading: "Гибка листового металла",
          paragraphs: [
            "Гибку выполняем на листогибочных прессах с ЧПУ — это гарантирует точный угол и повторяемость на всей партии. Изготавливаем короба, кронштейны, профили, корпуса и другие гнутые изделия по чертежу заказчика.",
          ],
        },
        {
          heading: "Перфорирование",
          paragraphs: [
            "Перфорирование — это создание отверстий заданной формы и шага. Применяется для декоративных панелей, фасадных кассет, вентиляционных решёток, фильтров и просечных листов. Форму и рисунок перфорации подбираем под задачу.",
          ],
        },
        {
          heading: "Преимущества обработки в МКМ",
          bullets: [
            "Точность реза до 0,1 мм по чертежу",
            "Резка стали, нержавейки, алюминия и оцинковки",
            "Гибка на ЧПУ с точным углом и повторяемостью",
            "Единичные детали и серийные партии, доставка по Узбекистану",
          ],
        },
      ],
      highlights: [
        "Лазерная резка металла 0,5–20 мм",
        "Гибка на прессах с ЧПУ",
        "Перфорирование любой формы",
        "Изготовление по чертежам DXF/DWG",
      ],
    },
    uz: {
      seoTitle:
        "Toshkentda metallni lazerli kesish, egish va perforatsiya — MKM",
      seoDescription:
        "Toshkentda listli metallni lazerli kesish, CNC'da egish va perforatsiya. Yuqori aniqlik, po'lat, zanglamas po'lat va alyuminiyni chizma bo'yicha kesish. MKM ishlab chiqarishi, O'zbekiston bo'ylab yetkazib berish.",
      title: "Lazerli kesish, egish, perforatsiya",
      subtitle:
        "Toshkentda CNC uskunalarida listli metallni aniq qayta ishlash",
      intro:
        "Lazerli kesish — bu listli metallni lazer nuri bilan raqamli chizma bo'yicha yuqori aniqlikda kesish. MKM kompaniyasi Toshkentda zamonaviy CNC uskunalarida metallni lazerli kesish, egish va perforatsiya qiladi. Detal va zagotovkalarni chizmangiz bo'yicha millimetrning o'ndan bir ulushigacha aniqlik bilan tayyorlaymiz.",
      sections: [
        {
          heading: "Metallni lazerli kesish",
          paragraphs: [
            "Uglerodli va zanglamas po'lat, alyuminiy, sinklangan list va boshqa metallarni 0,5 dan 20 mm gacha qalinlikda kesamiz. Lazer chetni deformatsiyasiz va qirralarsiz toza kesadi, shuning uchun detallar qo'shimcha ishlovni talab qilmaydi.",
            "DXF, DWG va boshqa formatdagi fayllar bo'yicha ishlaymiz — yakka detaldan seriyali ishlab chiqarishgacha. Kesish listga moslashtiriladi, bu metall sarfini va buyurtma narxini kamaytiradi.",
          ],
        },
        {
          heading: "Listli metallni egish",
          paragraphs: [
            "Egishni CNC listegar preslarida bajaramiz — bu butun partiyada aniq burchak va takrorlanishni kafolatlaydi. Buyurtmachi chizmasi bo'yicha qutilar, kronshteynlar, profillar, korpuslar va boshqa egilgan buyumlarni tayyorlaymiz.",
          ],
        },
        {
          heading: "Perforatsiya",
          paragraphs: [
            "Perforatsiya — berilgan shakl va qadamdagi teshiklar hosil qilish. Dekorativ panellar, fasad kassetalari, ventilyatsiya panjaralari, filtrlar va teshikli listlar uchun qo'llaniladi. Perforatsiya shakli va naqshini vazifaga qarab tanlaymiz.",
          ],
        },
        {
          heading: "MKM'da qayta ishlash afzalliklari",
          bullets: [
            "Chizma bo'yicha 0,1 mm gacha kesish aniqligi",
            "Po'lat, zanglamas po'lat, alyuminiy va sinklangan listni kesish",
            "CNC'da aniq burchak va takrorlanish bilan egish",
            "Yakka detallar va seriyali partiyalar, O'zbekiston bo'ylab yetkazish",
          ],
        },
      ],
      highlights: [
        "Metallni 0,5–20 mm lazerli kesish",
        "CNC preslarida egish",
        "Istalgan shakldagi perforatsiya",
        "DXF/DWG chizmalar bo'yicha ishlab chiqarish",
      ],
    },
  },

  turning: {
    ru: {
      seoTitle: "Токарные услуги в Ташкенте — токарная обработка металла | МКМ",
      seoDescription:
        "Токарные работы в Ташкенте: обработка металла на токарных и токарно-фрезерных станках с ЧПУ. Изготовление деталей, валов, втулок по чертежам. Компания МКМ, доставка по Узбекистану.",
      title: "Токарные услуги",
      subtitle:
        "Токарная обработка металла и изготовление деталей по чертежам в Ташкенте",
      intro:
        "Токарные услуги — это механическая обработка металла резанием для изготовления деталей вращения: валов, втулок, фланцев, штуцеров и других изделий. Компания МКМ выполняет токарные работы в Ташкенте на универсальных и ЧПУ-станках, обрабатывая сталь, нержавейку, чугун, латунь и алюминий по чертежам и образцам заказчика.",
      sections: [
        {
          heading: "Какие работы выполняем",
          bullets: [
            "Точение наружных и внутренних поверхностей",
            "Нарезание резьбы, сверление, расточка отверстий",
            "Изготовление валов, втулок, фланцев, шкивов, штуцеров",
            "Изготовление деталей по образцу и восстановление изношенных",
          ],
        },
        {
          heading: "Токарная обработка на ЧПУ",
          paragraphs: [
            "Станки с ЧПУ обеспечивают высокую точность и повторяемость при серийном производстве. Мы изготавливаем партии одинаковых деталей с точным соблюдением размеров и качества поверхности, что особенно важно для ответственных узлов.",
          ],
        },
        {
          heading: "Материалы",
          paragraphs: [
            "Обрабатываем конструкционную и нержавеющую сталь, чугун, латунь, бронзу и алюминиевые сплавы. Подбираем режимы резания под материал и требования к детали, чтобы обеспечить нужную точность и чистоту поверхности.",
          ],
        },
        {
          heading: "Почему МКМ",
          paragraphs: [
            "Изготавливаем детали как поштучно, так и партиями, работаем по чертежам, эскизам и образцам. Соблюдаем сроки, контролируем размеры на выходе и организуем доставку готовых изделий по Ташкенту и всему Узбекистану.",
          ],
        },
      ],
      highlights: [
        "Токарная обработка на универсальных и ЧПУ-станках",
        "Валы, втулки, фланцы, штуцеры",
        "Нарезание резьбы и расточка",
        "Работа по чертежам и образцам",
      ],
    },
    uz: {
      seoTitle: "Toshkentda tokarlik xizmatlari — metallni tokarlik ishlovi | MKM",
      seoDescription:
        "Toshkentda tokarlik ishlari: metallni CNC tokarlik va tokarlik-frezalash stanoklarida qayta ishlash. Chizma bo'yicha detal, val, vtulka tayyorlash. MKM kompaniyasi, O'zbekiston bo'ylab yetkazib berish.",
      title: "Tokarlik xizmatlari",
      subtitle:
        "Toshkentda metallni tokarlik ishlovi va chizma bo'yicha detal tayyorlash",
      intro:
        "Tokarlik xizmatlari — bu aylanuvchi detallarni (val, vtulka, flanets, shtutser va boshqa buyumlarni) tayyorlash uchun metallni kesib mexanik qayta ishlash. MKM kompaniyasi Toshkentda universal va CNC stanoklarda tokarlik ishlarini bajaradi, po'lat, zanglamas po'lat, cho'yan, guruch va alyuminiyni buyurtmachi chizmasi va namunasi bo'yicha qayta ishlaydi.",
      sections: [
        {
          heading: "Qanday ishlarni bajaramiz",
          bullets: [
            "Tashqi va ichki yuzalarni yo'nish",
            "Rezba kesish, parmalash, teshiklarni kengaytirish",
            "Val, vtulka, flanets, shkiv, shtutser tayyorlash",
            "Namuna bo'yicha detal tayyorlash va eskirganlarini tiklash",
          ],
        },
        {
          heading: "CNC'da tokarlik ishlovi",
          paragraphs: [
            "CNC stanoklari seriyali ishlab chiqarishda yuqori aniqlik va takrorlanishni ta'minlaydi. Biz bir xil detallar partiyasini o'lchov va yuza sifatiga aniq rioya qilgan holda tayyorlaymiz, bu ayniqsa mas'ul tugunlar uchun muhim.",
          ],
        },
        {
          heading: "Materiallar",
          paragraphs: [
            "Konstruksion va zanglamas po'lat, cho'yan, guruch, bronza va alyuminiy qotishmalarini qayta ishlaymiz. Kesish rejimlarini material va detalga qo'yilgan talablarga qarab tanlaymiz, shunda kerakli aniqlik va yuza tozaligi ta'minlanadi.",
          ],
        },
        {
          heading: "Nega MKM",
          paragraphs: [
            "Detallarni ham donalab, ham partiyalab tayyorlaymiz, chizma, eskiz va namunalar bo'yicha ishlaymiz. Muddatlarga rioya qilamiz, chiqishda o'lchovlarni nazorat qilamiz va tayyor buyumlarni Toshkent hamda butun O'zbekiston bo'ylab yetkazib beramiz.",
          ],
        },
      ],
      highlights: [
        "Universal va CNC stanoklarda tokarlik ishlovi",
        "Val, vtulka, flanets, shtutser",
        "Rezba kesish va teshik kengaytirish",
        "Chizma va namunalar bo'yicha ish",
      ],
    },
  },

  welding: {
    ru: {
      seoTitle:
        "Сварочные работы и изготовление металлоконструкций в Ташкенте — МКМ",
      seoDescription:
        "Сварочные работы и изготовление металлоконструкций в Ташкенте: фермы, каркасы, ограждения, лестницы, баки. Полуавтоматическая и аргоновая сварка. Компания МКМ, доставка и монтаж по Узбекистану.",
      title: "Сварочные работы и изготовление металлоконструкций",
      subtitle:
        "Изготовление металлоконструкций любой сложности по чертежам в Ташкенте",
      intro:
        "Сварочные работы и изготовление металлоконструкций — это создание прочных металлических изделий и каркасов путём соединения деталей сваркой. Компания МКМ выполняет сварку и производство металлоконструкций в Ташкенте: от отдельных узлов до готовых объектов по чертежам заказчика. Работаем со сталью, нержавейкой и алюминием.",
      sections: [
        {
          heading: "Что изготавливаем",
          bullets: [
            "Металлоконструкции: фермы, балки, колонны, каркасы зданий",
            "Ограждения, ворота, заборы, лестницы, площадки и навесы",
            "Ёмкости, баки, бункеры и нестандартные металлоизделия",
            "Закладные детали, кронштейны и опорные конструкции",
          ],
        },
        {
          heading: "Виды сварки",
          paragraphs: [
            "Полуавтоматическая сварка (MIG/MAG) применяется для конструкционной стали и обеспечивает прочный шов при высокой производительности.",
            "Аргоновая сварка (TIG) используется для нержавеющей стали и алюминия, где важны аккуратный шов и герметичность. Технологию подбираем под материал и назначение изделия.",
          ],
        },
        {
          heading: "Полный цикл: от чертежа до монтажа",
          paragraphs: [
            "Изготавливаем металлоконструкции по вашим чертежам или разрабатываем конструктив под задачу. При необходимости выполняем антикоррозийную обработку — цинкование и окраску — а также доставку и монтаж на объекте по всему Узбекистану.",
          ],
        },
        {
          heading: "Почему МКМ",
          paragraphs: [
            "Опытные сварщики, контроль качества швов и соблюдение сроков. Берём как небольшие заказы, так и крупные партии металлоконструкций для строительных, промышленных и нефтегазовых объектов.",
          ],
        },
      ],
      highlights: [
        "Изготовление металлоконструкций по чертежам",
        "Полуавтоматическая и аргоновая сварка",
        "Антикоррозийная обработка изделий",
        "Доставка и монтаж по Узбекистану",
      ],
    },
    uz: {
      seoTitle:
        "Toshkentda payvandlash ishlari va metall konstruksiyalar ishlab chiqarish — MKM",
      seoDescription:
        "Toshkentda payvandlash ishlari va metall konstruksiyalar ishlab chiqarish: fermalar, karkaslar, to'siqlar, zinapoyalar, baklar. Yarim avtomat va argon payvandlash. MKM kompaniyasi, O'zbekiston bo'ylab yetkazish va montaj.",
      title: "Payvandlash ishlari va metall konstruksiyalar ishlab chiqarish",
      subtitle:
        "Toshkentda chizma bo'yicha har qanday murakkablikdagi metall konstruksiyalar ishlab chiqarish",
      intro:
        "Payvandlash ishlari va metall konstruksiyalar ishlab chiqarish — bu detallarni payvand orqali birlashtirib mustahkam metall buyum va karkaslar yaratish. MKM kompaniyasi Toshkentda payvandlash va metall konstruksiyalar ishlab chiqarishni bajaradi: alohida tugunlardan buyurtmachi chizmasi bo'yicha tayyor obyektlargacha. Po'lat, zanglamas po'lat va alyuminiy bilan ishlaymiz.",
      sections: [
        {
          heading: "Nima ishlab chiqaramiz",
          bullets: [
            "Metall konstruksiyalar: fermalar, balkalar, ustunlar, bino karkaslari",
            "To'siqlar, darvozalar, zinapoyalar, maydonchalar va soyabonlar",
            "Idishlar, baklar, bunkerlar va nostandart metall buyumlar",
            "O'rnatma detallar, kronshteynlar va tayanch konstruksiyalar",
          ],
        },
        {
          heading: "Payvandlash turlari",
          paragraphs: [
            "Yarim avtomat payvandlash (MIG/MAG) konstruksion po'lat uchun qo'llaniladi va yuqori unumdorlikda mustahkam chok beradi.",
            "Argon payvandlash (TIG) zanglamas po'lat va alyuminiy uchun ishlatiladi, bu yerda toza chok va germetiklik muhim. Texnologiyani material va buyum vazifasiga qarab tanlaymiz.",
          ],
        },
        {
          heading: "To'liq sikl: chizmadan montajgacha",
          paragraphs: [
            "Metall konstruksiyalarni chizmangiz bo'yicha tayyorlaymiz yoki vazifaga mos konstruktiv ishlab chiqamiz. Zarur bo'lsa korroziyaga qarshi ishlov — sinklash va bo'yash — hamda O'zbekiston bo'ylab obyektda yetkazib berish va montaj bajaramiz.",
          ],
        },
        {
          heading: "Nega MKM",
          paragraphs: [
            "Tajribali payvandchilar, chok sifatini nazorat qilish va muddatlarga rioya. Ham kichik buyurtmalarni, ham qurilish, sanoat va neft-gaz obyektlari uchun yirik metall konstruksiya partiyalarini qabul qilamiz.",
          ],
        },
      ],
      highlights: [
        "Chizma bo'yicha metall konstruksiyalar ishlab chiqarish",
        "Yarim avtomat va argon payvandlash",
        "Buyumlarga korroziyaga qarshi ishlov",
        "O'zbekiston bo'ylab yetkazish va montaj",
      ],
    },
  },
};

/** Список slug'ов, для которых есть контент детальной страницы. */
export const serviceContentSlugs = Object.keys(servicesContent);

/** Есть ли расширенный контент для услуги. */
export function hasServiceContent(slug: string): boolean {
  return slug in servicesContent;
}

/** Контент услуги для конкретной локали (или null, если не найден). */
export function getServiceContent(
  slug: string,
  locale: Locale
): ServiceContent | null {
  return servicesContent[slug]?.[locale] ?? null;
}
