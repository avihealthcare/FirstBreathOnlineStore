import { NextResponse } from "next/server";
import type { OrderStatus } from "@prisma/client";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { mapOrder } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const statusMap: Record<string, OrderStatus> = {
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  Packed: "PACKED",
  Shipped: "SHIPPED",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED"
};

type OrderRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: OrderRouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: string; internalNotes?: string } | null;
  const status = body?.status ? statusMap[body.status] : undefined;

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      internalNotes: body?.internalNotes ?? null
    },
    include: { items: { include: { product: true } }, customer: true }
  });

  return NextResponse.json({ ok: true, order: mapOrder(order) });
}
