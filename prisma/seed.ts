import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";
import * as catalogData from "../src/data/catalog.json";
import * as categoriesData from "../src/data/categories.json";

const SERVICES_SEED = [
  {
    slug: "coating",
    icon: "building",
    titleRu: "Цинкование, окраска",
    titleUz: "Sinklash, bo'yash",
    descriptionRu:
      "Антикоррозийная защита металлоизделий: горячее и холодное цинкование, порошковая окраска. Долговечная защита от коррозии и механических воздействий.",
    descriptionUz:
      "Metall mahsulotlarni korroziyadan himoya qilish: issiq va sovuq sinklash, kukunli bo'yash. Korroziya va mexanik ta'sirlardan uzoq muddatli himoya.",
  },
  {
    slug: "laser",
    icon: "pipe",
    titleRu: "Лазерная резка, гибка, перфорирование",
    titleUz: "Lazerli kesish, egish, perforatsiya",
    descriptionRu:
      "Высокоточная лазерная резка, гибка листового металла и перфорирование по чертежам заказчика. Минимальные допуски и чистый рез без заусенцев.",
    descriptionUz:
      "Buyurtmachining chizmalari bo'yicha yuqori aniqlikdagi lazerli kesish, list metallni egish va perforatsiya. Minimal toleranslar va chuqursiz toza kesim.",
  },
  {
    slug: "turning",
    icon: "certificate",
    titleRu: "Токарные услуги",
    titleUz: "Tokarlik xizmatlari",
    descriptionRu:
      "Токарная обработка металла любой сложности: изготовление деталей, валов, втулок, фланцев и нестандартных изделий по чертежам.",
    descriptionUz:
      "Har qanday murakkablikdagi metall tokarlik ishlovi: chizmalar bo'yicha detallar, vallar, gilzalar, flanetslar va nostandart mahsulotlar tayyorlash.",
  },
  {
    slug: "welding",
    icon: "flame",
    titleRu: "Сварочные работы и изготовление металлоконструкций",
    titleUz: "Payvandlash ishlari va metall konstruksiyalar ishlab chiqarish",
    descriptionRu:
      "Полуавтоматическая, аргонодуговая и ручная дуговая сварка. Изготовление металлоконструкций, рам, ограждений, баков, лестниц и других изделий по чертежам заказчика.",
    descriptionUz:
      "Yarim avtomatik, argon-yoy va qo'lda yoy payvandlash. Buyurtmachining chizmalari bo'yicha metall konstruksiyalar, ramkalar, to'siqlar, baklar, narvonlar va boshqa mahsulotlarni tayyorlash.",
  },
];

const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx === -1) continue;
    const k = t.slice(0, idx).trim();
    const v = t.slice(idx + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

const adapter = new PrismaNeonHttp(process.env.DIRECT_URL!, {});
const prisma = new PrismaClient({ adapter } as any);

const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d374.6482916886723!2d69.3564071929702!3d41.30480986702036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE4JzE3LjQiTiA2OcKwMjEnMjQuNCJF!5e0!3m2!1sru!2s!4v1773224533050!5m2!1sru!2s";

async function main() {
  console.log("Seeding categories...");

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as any).default ?? [];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        nameRu: cat.name.ru,
        nameUz: cat.name.uz,
        slug: cat.slug,
        descRu: cat.description.ru,
        descUz: cat.description.uz,
        icon: cat.icon,
        image: cat.image,
        order: cat.order,
      },
      create: {
        id: cat.id,
        nameRu: cat.name.ru,
        nameUz: cat.name.uz,
        slug: cat.slug,
        descRu: cat.description.ru,
        descUz: cat.description.uz,
        icon: cat.icon,
        image: cat.image,
        order: cat.order,
      },
    });
  }

  console.log(`Seeded ${categories.length} categories`);

  console.log("Seeding products...");

  const raw = catalogData as any;
  const products = raw.products ?? raw.default?.products ?? [];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        nameRu: product.name.ru,
        nameUz: product.name.uz,
        descRu: product.description.ru,
        descUz: product.description.uz,
        categoryId: product.categoryId,
        typeRu: product.productType.ru,
        typeUz: product.productType.uz,
        materials: product.materials,
        purposes: product.purposes,
        standards: product.standards,
      },
      create: {
        id: product.id,
        nameRu: product.name.ru,
        nameUz: product.name.uz,
        descRu: product.description.ru,
        descUz: product.description.uz,
        categoryId: product.categoryId,
        typeRu: product.productType.ru,
        typeUz: product.productType.uz,
        materials: product.materials,
        purposes: product.purposes,
        standards: product.standards,
      },
    });
  }

  console.log(`Seeded ${products.length} products`);

  console.log("Seeding services...");

  let serviceOrder = 0;
  let createdServices = 0;
  for (const svc of SERVICES_SEED) {
    const existing = await prisma.service.findUnique({ where: { slug: svc.slug } });
    if (!existing) {
      await prisma.service.create({
        data: { ...svc, order: serviceOrder, isActive: true, image: "" },
      });
      createdServices += 1;
    }
    serviceOrder += 1;
  }

  console.log(`Seeded ${createdServices} new services (${SERVICES_SEED.length} total)`);

  console.log("Seeding partners...");

  const partnersDir = path.resolve(__dirname, "../public/images/partners-logos");
  const partnerFiles = fs
    .readdirSync(partnersDir)
    .filter((f) => f.startsWith("partner-") && f.endsWith(".png"))
    .sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ""), 10);
      const nb = parseInt(b.replace(/\D/g, ""), 10);
      return na - nb;
    });

  const existingPartners = await prisma.partner.findMany({ select: { logo: true } });
  const existingLogos = new Set(existingPartners.map((p) => p.logo));

  let partnerOrder = 0;
  let createdPartners = 0;
  for (const file of partnerFiles) {
    const logo = `/images/partners-logos/${file}`;
    if (existingLogos.has(logo)) {
      partnerOrder += 1;
      continue;
    }
    const num = parseInt(file.replace(/\D/g, ""), 10);
    await prisma.partner.create({
      data: {
        name: `Партнёр ${num + 1}`,
        logo,
        order: partnerOrder,
        isActive: true,
      },
    });
    partnerOrder += 1;
    createdPartners += 1;
  }

  console.log(`Seeded ${createdPartners} new partners (${partnerFiles.length} files total)`);

  console.log("Seeding site settings...");

  const existingSettings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        id: "singleton",
        phone1: "+998 88 999 38 38",
        phone2: "+998 88 979 79 97",
        email: "mkm_metal@mail.ru",
        addressRu: "г. Ташкент, ул. Темирчи, 19",
        addressUz: "Toshkent sh., Temirchi ko'ch., 19",
        mapEmbedUrl: DEFAULT_MAP_EMBED,
        telegramUrl: "",
        instagramUrl: "",
        whatsappUrl: "",
        workingHoursRu: "",
        workingHoursUz: "",
      },
    });
    console.log("Seeded site settings (singleton, created)");
  } else {
    console.log("Site settings already exist, skipping");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
