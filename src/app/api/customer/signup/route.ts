import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
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

  let customer;
  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const customerId = `customer-${crypto.randomUUID()}`;
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Customer" ("id", "fullName", "mobile", "email", "passwordHash", "hospitalName", "gstNumber", "savedProductSlugs", "recentlyPurchasedSlugs", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, ARRAY[]::TEXT[], ARRAY[]::TEXT[], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      customerId,
      parsed.data.fullName,
      parsed.data.mobile?.trim() || null,
      email,
      passwordHash,
      parsed.data.hospitalName,
      parsed.data.gstNumber?.trim() || null
    );
    customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        addresses: true,
        orders: { include: { items: { include: { product: true } } } }
      }
    });
    if (!customer) throw new Error("Account was created but profile could not be loaded.");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2002" || (error.code === "P2010" && String(error.message).toLowerCase().includes("duplicate")))
    ) {
      return NextResponse.json({ ok: false, error: "An account already exists with this email or mobile number." }, { status: 409 });
    }

    return NextResponse.json(
      { ok: false, error: "Unable to create account. Please confirm the Supabase schema is updated and try again." },
      { status: 500 }
    );
  }

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
