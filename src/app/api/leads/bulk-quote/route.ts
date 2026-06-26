import { NextResponse } from "next/server";
import {
  buildLeadNumber,
  cleanMobileNumber,
  createLeadId,
  getExistingProductId,
  notifySalesTeam,
  sendQuoteAcknowledgement
} from "@/lib/lead-utils";
import { prisma } from "@/lib/prisma";
import { bulkQuoteSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bulkQuoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid quote request." }, { status: 400 });
  }

  try {
    const leadNumber = await buildLeadNumber("QR");
    const leadId = createLeadId();
    const productId = await getExistingProductId(parsed.data.productId);
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Lead" ("id", "leadNumber", "type", "status", "productId", "productName", "variant", "name", "mobile", "email", "companyName", "cityState", "estimatedQuantity", "purchaseType", "expectedTimeline", "additionalRequirements", "fileName", "notificationStatus", "createdAt", "updatedAt")
       VALUES ($1, $2, CAST($3 AS "LeadType"), CAST($4 AS "LeadStatus"), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      leadId,
      leadNumber,
      "BULK_QUOTE",
      "NEW_QUOTE_REQUEST",
      productId,
      parsed.data.productName,
      parsed.data.variant || null,
      parsed.data.name,
      cleanMobileNumber(parsed.data.mobile),
      parsed.data.email,
      parsed.data.companyName,
      parsed.data.cityState || null,
      parsed.data.estimatedQuantity,
      parsed.data.purchaseType,
      parsed.data.expectedTimeline || null,
      parsed.data.additionalRequirements || null,
      parsed.data.fileName || null
    );

    const acknowledgement = await sendQuoteAcknowledgement({
      leadNumber,
      customerEmail: parsed.data.email,
      customerName: parsed.data.name,
      productName: parsed.data.productName
    });
    const salesNotification = await notifySalesTeam({
      leadNumber,
      customerEmail: parsed.data.email,
      customerName: parsed.data.name,
      productName: parsed.data.productName
    });

    await prisma.$executeRawUnsafe(
      `UPDATE "Lead" SET "notificationStatus" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = $2`,
      `${acknowledgement.status}; ${salesNotification.status}`,
      leadId
    );

    return NextResponse.json({
      ok: true,
      leadNumber,
      responseTime: "Our sales team will respond within 1 working day."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to submit quote request." },
      { status: 500 }
    );
  }
}
