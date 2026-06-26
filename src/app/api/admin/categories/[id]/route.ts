import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CategoryRouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: CategoryRouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
