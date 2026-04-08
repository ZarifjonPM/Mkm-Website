import { defineConfig } from "prisma/config";

// DIRECT_URL is used by Prisma CLI (db push, migrate) — Neon direct connection
// DATABASE_URL (pooled) is used by PrismaClient at runtime via the Neon adapter in src/lib/db.ts
export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
