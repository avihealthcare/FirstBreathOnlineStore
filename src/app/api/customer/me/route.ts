import { NextResponse } from "next/server";
import { getCurrentCustomer, mapCustomerProfile } from "@/lib/customer-auth";

export const runtime = "nodejs";

export async function GET() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return NextResponse.json({ ok: false, customer: null }, { status: 401 });
  }

  return NextResponse.json({ ok: true, customer: mapCustomerProfile(customer) });
}
