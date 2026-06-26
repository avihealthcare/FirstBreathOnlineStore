import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ProductRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function DELETE(_request: Request, { params }: ProductRouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  await prisma.product.delete({ where: { slug } });

  return NextResponse.json({ ok: true });
}
