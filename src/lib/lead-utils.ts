import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function createLeadId() {
  return `lead-${crypto.randomUUID()}`;
}

export function cleanMobileNumber(value: string) {
  return value.replace(/[^\d]/g, "").replace(/^91(?=[6-9]\d{9}$)/, "");
}

export function toWhatsAppDialNumber(value: string | undefined) {
  const digits = (value ?? "").replace(/[^\d]/g, "");
  if (!digits) return "919876543210";
  return digits.length === 10 ? `91${digits}` : digits;
}

export async function buildLeadNumber(prefix: "QR" | "WA") {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const random = Math.floor(100000 + Math.random() * 900000);
    const leadNumber = `AVI-${prefix}-${year}-${random}`;
    const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT "id" FROM "Lead" WHERE "leadNumber" = $1 LIMIT 1`,
      leadNumber
    );
    if (!existing.length) return leadNumber;
  }
  return `AVI-${prefix}-${year}-${Date.now()}`;
}

export async function getExistingProductId(productId: string | undefined) {
  if (!productId) return null;
  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `SELECT "id" FROM "Product" WHERE "id" = $1 LIMIT 1`,
    productId
  );
  return rows[0]?.id ?? null;
}

export async function getSalesWhatsAppNumber() {
  const settings = await prisma.storeSetting.findFirst({ orderBy: { updatedAt: "desc" } }).catch(() => null);
  return toWhatsAppDialNumber(settings?.whatsappNumber ?? undefined);
}

export type QuoteNotificationPayload = {
  leadNumber: string;
  customerEmail: string;
  customerName: string;
  productName: string;
};

export async function sendQuoteAcknowledgement(payload: QuoteNotificationPayload) {
  if (!process.env.SMTP_HOST) {
    console.info("Email placeholder: quote acknowledgement", payload);
    return { ok: true, status: "PLACEHOLDER_NO_SMTP" };
  }

  console.info("Email provider integration pending", payload);
  return { ok: true, status: "SMTP_PROVIDER_PENDING" };
}

export async function notifySalesTeam(payload: QuoteNotificationPayload) {
  if (!process.env.SMTP_HOST) {
    console.info("Email placeholder: sales notification", payload);
    return { ok: true, status: "PLACEHOLDER_NO_SMTP" };
  }

  console.info("Sales email provider integration pending", payload);
  return { ok: true, status: "SMTP_PROVIDER_PENDING" };
}
