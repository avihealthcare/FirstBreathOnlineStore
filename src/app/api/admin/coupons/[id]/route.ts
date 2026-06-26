import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CouponRouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: CouponRouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.discountCoupon.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
