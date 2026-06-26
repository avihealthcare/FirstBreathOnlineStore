import { NextResponse } from "next/server";
import { getCurrentCustomerId, mapCustomerProfile } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { customerProfileSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const customerId = await getCurrentCustomerId();
  if (!customerId) {
    return NextResponse.json({ ok: false, error: "Please login first." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = customerProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid profile details." }, { status: 400 });
  }

  await prisma.$executeRawUnsafe(
    `UPDATE "Customer"
     SET "fullName" = $1, "email" = $2, "mobile" = $3, "hospitalName" = $4, "gstNumber" = $5, "updatedAt" = CURRENT_TIMESTAMP
     WHERE "id" = $6`,
    parsed.data.fullName,
    parsed.data.email.trim().toLowerCase(),
    parsed.data.mobile?.trim() || null,
    parsed.data.hospitalName?.trim() || null,
    parsed.data.gstNumber?.trim() || null,
    customerId
  );

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
      orders: { include: { items: { include: { product: true } } } }
    }
  });

  if (!customer) {
    return NextResponse.json({ ok: false, error: "Customer profile not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, customer: mapCustomerProfile(customer) });
}
