import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { mapLead } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import type { AdminLead } from "@/types";

export const runtime = "nodejs";

type LeadRouteProps = {
  params: Promise<{ id: string }>;
};

const allowedStatuses: AdminLead["status"][] = [
  "NEW_QUOTE_REQUEST",
  "WHATSAPP_ENQUIRY",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "CLOSED"
];

export async function PATCH(request: Request, { params }: LeadRouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: AdminLead["status"] } | null;

  if (!body?.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ ok: false, error: "Select a valid lead status." }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<
    {
      id: string;
      leadNumber: string;
      type: string;
      status: string;
      productName: string;
      variant: string | null;
      name: string;
      mobile: string;
      email: string | null;
      companyName: string | null;
      cityState: string | null;
      estimatedQuantity: number | null;
      purchaseType: string | null;
      expectedTimeline: string | null;
      additionalRequirements: string | null;
      fileName: string | null;
      whatsappMessage: string | null;
      notificationStatus: string;
      createdAt: Date;
    }[]
  >(
    `UPDATE "Lead"
     SET "status" = CAST($1 AS "LeadStatus"), "updatedAt" = CURRENT_TIMESTAMP
     WHERE "id" = $2
     RETURNING "id", "leadNumber", "type"::text AS "type", "status"::text AS "status", "productName", "variant", "name", "mobile", "email", "companyName", "cityState", "estimatedQuantity", "purchaseType", "expectedTimeline", "additionalRequirements", "fileName", "whatsappMessage", "notificationStatus", "createdAt"`,
    body.status,
    id
  );

  if (!rows.length) {
    return NextResponse.json({ ok: false, error: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: mapLead(rows[0]) });
}
