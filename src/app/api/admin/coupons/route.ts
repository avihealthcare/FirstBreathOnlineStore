import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { DiscountCoupon } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { coupon?: DiscountCoupon } | null;
  const coupon = body?.coupon;

  if (!coupon?.code || !coupon.description) {
    return NextResponse.json({ ok: false, error: "Coupon code and description are required." }, { status: 400 });
  }

  const code = coupon.code.trim().toUpperCase();
  const saved = await prisma.discountCoupon.upsert({
    where: { code },
    update: {
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      isActive: coupon.isActive
    },
    create: {
      code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      isActive: coupon.isActive
    }
  });

  return NextResponse.json({
    ok: true,
    coupon: {
      id: saved.id,
      code: saved.code,
      description: saved.description,
      type: saved.type === "fixed" ? "fixed" : "percentage",
      value: Number(saved.value),
      minOrderValue: Number(saved.minOrderValue),
      isActive: saved.isActive
    }
  });
}
