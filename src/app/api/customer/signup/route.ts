import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, mapCustomerProfile, signCustomerSession } from "@/lib/customer-auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { customerSignupSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = customerSignupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid signup details." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await prisma.customer.findFirst({ where: { email } });

  if (existing) {
    return NextResponse.json({ ok: false, error: "An account already exists for this email." }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const customer = await prisma.customer.create({
    data: {
      fullName: parsed.data.fullName,
      email,
      passwordHash,
      mobile: parsed.data.mobile?.trim() || null,
      hospitalName: parsed.data.hospitalName,
      gstNumber: parsed.data.gstNumber?.trim() || null
    },
    include: {
      addresses: true,
      orders: { include: { items: { include: { product: true } } } }
    }
  });

  const response = NextResponse.json({ ok: true, customer: mapCustomerProfile(customer) });
  response.cookies.set(CUSTOMER_COOKIE, signCustomerSession(customer.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
