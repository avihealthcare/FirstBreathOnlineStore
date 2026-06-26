import { NextResponse } from "next/server";
import { buildLeadNumber, cleanMobileNumber, createLeadId, getExistingProductId, getSalesWhatsAppNumber } from "@/lib/lead-utils";
import { prisma } from "@/lib/prisma";
import { whatsappEnquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = whatsappEnquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid WhatsApp enquiry." }, { status: 400 });
  }

  try {
    const leadNumber = await buildLeadNumber("WA");
    const leadId = createLeadId();
    const productId = await getExistingProductId(parsed.data.productId);
    const mobile = cleanMobileNumber(parsed.data.mobile);
    const message = [
      `Enquiry ID: ${leadNumber}`,
      `Product: ${parsed.data.productName}`,
      parsed.data.variant ? `Variant: ${parsed.data.variant}` : "",
      `Quantity: ${parsed.data.quantity}`,
      `Customer Name: ${parsed.data.name}`,
      parsed.data.companyName ? `Company/Hospital: ${parsed.data.companyName}` : "",
      `Mobile Number: ${mobile}`
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Lead" ("id", "leadNumber", "type", "status", "productId", "productName", "variant", "name", "mobile", "companyName", "estimatedQuantity", "whatsappMessage", "notificationStatus", "createdAt", "updatedAt")
       VALUES ($1, $2, CAST($3 AS "LeadType"), CAST($4 AS "LeadStatus"), $5, $6, $7, $8, $9, $10, $11, $12, 'WHATSAPP_REDIRECT_CREATED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      leadId,
      leadNumber,
      "WHATSAPP_ENQUIRY",
      "WHATSAPP_ENQUIRY",
      productId,
      parsed.data.productName,
      parsed.data.variant || null,
      parsed.data.name,
      mobile,
      parsed.data.companyName || null,
      parsed.data.quantity,
      message
    );

    const whatsappNumber = await getSalesWhatsAppNumber();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ ok: true, leadNumber, whatsappUrl });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create WhatsApp enquiry." },
      { status: 500 }
    );
  }
}
