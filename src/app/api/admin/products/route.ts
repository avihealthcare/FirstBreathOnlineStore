import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { mapProduct, slugify, splitLines } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { adminProductSchema, type AdminProductInput } from "@/lib/validation";

export const runtime = "nodejs";

function parseVariants(value: string) {
  return splitLines(value).map((item) => {
    const [name, ...rest] = item.split(":");
    return {
      name: rest.length ? name.trim() : "Option",
      value: rest.length ? rest.join(":").trim() : item,
      stockQuantity: 25,
      sterile: !/non-sterile/i.test(item)
    };
  });
}

async function upsertProduct(input: AdminProductInput, existingSlug?: string) {
  const slug = slugify(input.slug || input.name);
  const categorySlug = slugify(input.categorySlug || input.category);
  const imageUrls = splitLines(input.imageUrls);
  const similarSlugs = splitLines(input.similarProducts);

  return prisma.$transaction(async (tx) => {
    const category = await tx.category.upsert({
      where: { slug: categorySlug },
      update: { name: input.category, isActive: true },
      create: {
        name: input.category,
        slug: categorySlug,
        description: `${input.category} products for NICU and hospital workflows.`,
        isActive: true
      }
    });
    const existing = existingSlug ? await tx.product.findUnique({ where: { slug: existingSlug } }) : null;
    const similarProducts = similarSlugs.length
      ? await tx.product.findMany({ where: { slug: { in: similarSlugs } }, select: { id: true } })
      : [];

    const data = {
      name: input.name,
      slug,
      sku: input.sku,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      price: input.price,
      salePrice: input.salePrice && input.salePrice > 0 ? input.salePrice : null,
      categoryId: category.id,
      tags: splitLines(input.tags),
      features: splitLines(input.features),
      stockQuantity: input.stockQuantity,
      availability: input.availability,
      shippingDetails: input.shippingDetails,
      isFeatured: input.isFeatured,
      isNewArrival: input.isNewArrival,
      isBestSeller: input.isBestSeller,
      status: "PUBLISHED" as const
    };

    let productId = existing?.id;

    if (existing) {
      await tx.product.update({
        where: { id: existing.id },
        data: {
          ...data,
          similarProducts: { set: similarProducts.map((product) => ({ id: product.id })) }
        }
      });
      productId = existing.id;
      await tx.productImage.deleteMany({ where: { productId } });
      await tx.productVariant.deleteMany({ where: { productId } });
    } else {
      const product = await tx.product.create({
        data: {
          ...data,
          similarProducts: { connect: similarProducts.map((product) => ({ id: product.id })) }
        }
      });
      productId = product.id;
    }

    await tx.productImage.createMany({
      data: imageUrls.map((url, index) => ({
        productId: productId!,
        url,
        alt: input.name,
        sortOrder: index
      }))
    });

    await tx.productVariant.createMany({
      data: parseVariants(input.variants).map((variant) => ({
        productId: productId!,
        ...variant
      }))
    });

    await tx.sEOSetting.upsert({
      where: { id: `seo-product-${productId}` },
      update: {
        slug,
        seoTitle: input.seoTitle,
        metaDescription: input.metaDescription,
        keywords: splitLines(input.tags),
        productId
      },
      create: {
        id: `seo-product-${productId}`,
        entityType: "PRODUCT",
        entityId: productId,
        productId,
        slug,
        seoTitle: input.seoTitle,
        metaDescription: input.metaDescription,
        keywords: splitLines(input.tags),
        shouldIndex: true
      }
    });

    const savedProduct = await tx.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        similarProducts: { select: { slug: true } }
      }
    });

    if (!savedProduct) throw new Error("Product save failed.");
    return mapProduct(savedProduct);
  });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      similarProducts: { select: { slug: true } }
    },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ ok: true, products: products.map(mapProduct) });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminProductSchema.safeParse(body?.product);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid product details." }, { status: 400 });
  }

  try {
    const product = await upsertProduct(parsed.data, body?.existingSlug);
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save product." },
      { status: 500 }
    );
  }
}
