import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { slugify } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body?.category);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid category details." }, { status: 400 });
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  const category = parsed.data.id
    ? await prisma.category.update({
        where: { id: parsed.data.id },
        data: {
          name: parsed.data.name,
          slug,
          description: parsed.data.description,
          image: parsed.data.image || null,
          isActive: parsed.data.isActive,
          sortOrder: parsed.data.sortOrder
        },
        include: { _count: { select: { products: true } } }
      })
    : await prisma.category.upsert({
        where: { slug },
        update: {
          name: parsed.data.name,
          description: parsed.data.description,
          image: parsed.data.image || null,
          isActive: parsed.data.isActive,
          sortOrder: parsed.data.sortOrder
        },
        create: {
          name: parsed.data.name,
          slug,
          description: parsed.data.description,
          image: parsed.data.image || null,
          isActive: parsed.data.isActive,
          sortOrder: parsed.data.sortOrder
        },
        include: { _count: { select: { products: true } } }
      });

  return NextResponse.json({
    ok: true,
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image ?? undefined,
      count: category._count.products,
      isActive: category.isActive,
      sortOrder: category.sortOrder
    }
  });
}
