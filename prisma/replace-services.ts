import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import * as fs from "fs";
import * as path from "path";

const NEW_SERVICES = [
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

async function main() {
  const existing = await prisma.service.findMany();
  console.log(`Found ${existing.length} existing services. Removing...`);

  await prisma.service.deleteMany({});
  console.log("All existing services removed.");

  console.log("Creating new services...");
  let order = 0;
  for (const svc of NEW_SERVICES) {
    await prisma.service.create({
      data: { ...svc, order, isActive: true, image: "" },
    });
    order += 1;
    console.log(`  + ${svc.titleRu}`);
  }

  console.log(`\nDone. ${NEW_SERVICES.length} services in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
