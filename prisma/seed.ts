import { PrismaClient } from "@prisma/client";
import * as catalogData from "../src/data/catalog.json";
import * as categoriesData from "../src/data/categories.json";

const prisma = new PrismaClient();

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
