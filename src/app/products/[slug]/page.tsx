import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/commerce/product-detail-client";
import { getCatalogProducts, getProductBySlugFromDb } from "@/lib/catalog";

type ProductDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromDb(slug);

  if (!product) {
    return {
      title: "Product",
      description: "AVI FirstBreath Store product detail."
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    keywords: product.tags,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]]
    }
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const [initialProduct, allProducts] = await Promise.all([getProductBySlugFromDb(slug), getCatalogProducts()]);

  return <ProductDetailClient slug={slug} initialProduct={initialProduct} allProducts={allProducts} />;
}
