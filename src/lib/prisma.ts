import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return undefined;

  try {
    const url = new URL(databaseUrl);

    if (url.hostname.includes("pooler.supabase.com")) {
      if (url.port === "5432") {
        url.port = "6543";
      }

      if (!url.searchParams.has("pgbouncer")) {
        url.searchParams.set("pgbouncer", "true");
      }

      if (!url.searchParams.has("connection_limit")) {
        url.searchParams.set("connection_limit", "1");
      }

      if (!url.searchParams.has("pool_timeout")) {
        url.searchParams.set("pool_timeout", "20");
      }
    }

    return url.toString();
  } catch {
    return databaseUrl;
  }
}

const databaseUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {})
  });

globalForPrisma.prisma = prisma;
