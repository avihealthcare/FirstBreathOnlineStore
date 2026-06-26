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

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email.trim().toLowerCase(),
      mobile: parsed.data.mobile?.trim() || null,
      hospitalName: parsed.data.hospitalName?.trim() || null,
      gstNumber: parsed.data.gstNumber?.trim() || null
    },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
      orders: { include: { items: { include: { product: true } } } }
    }
  });

  return NextResponse.json({ ok: true, customer: mapCustomerProfile(customer) });
}
