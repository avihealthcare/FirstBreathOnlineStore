import type { Metadata } from "next";
import { ProductCatalog } from "@/components/commerce/product-catalog";
import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse neonatal consumables and disposable NICU products from AVI FirstBreath Store."
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "all";
  const [products, categories] = await Promise.all([getCatalogProducts(), getCatalogCategories()]);

  return (
    <div className="container py-8">
      <ProductCatalog products={products} categories={categories} initialSearch={search} initialCategory={category} />
    </div>
  );
}
