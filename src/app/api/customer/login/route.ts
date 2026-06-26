import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, mapCustomerProfile, signCustomerSession } from "@/lib/customer-auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { customerLoginSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = customerLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid login details." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const authRows = await prisma.$queryRawUnsafe<{ id: string; passwordHash: string | null }[]>(
    `SELECT "id", "passwordHash" FROM "Customer" WHERE lower("email") = lower($1) LIMIT 1`,
    email
  );
  const authCustomer = authRows[0];

  if (!authCustomer || !(await verifyPassword(parsed.data.password, authCustomer.passwordHash))) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: authCustomer.id },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
      orders: {
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!customer) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
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
