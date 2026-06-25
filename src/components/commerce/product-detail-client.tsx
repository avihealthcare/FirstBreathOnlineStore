"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { DetailPurchasePanel } from "@/components/commerce/detail-purchase-panel";
import { useAdminStore } from "@/store/admin-store";
import type { Product } from "@/types";

type ProductDetailClientProps = {
  slug: string;
  initialProduct?: Product;
};

export function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  const allProducts = useAdminStore((state) => state.products);
  const product = allProducts.find((item) => item.slug === slug) ?? initialProduct;

  if (!product) {
    return (
      <div className="container py-8">
        <EmptyState title="Product not found" description="This product may be unpublished, deleted, or not available in this browser session." />
        <Button asChild className="mt-5">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const similarProducts = product.similarProductSlugs
    .map((similarSlug) => allProducts.find((item) => item.slug === similarSlug))
    .filter(Boolean) as Product[];

  return (
    <div className="container py-8">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-600" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-avi-teal">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <Link href="/products" className="hover:text-avi-teal">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="font-semibold text-avi-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <ProductGallery images={product.images} name={product.name} />
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="navy">{product.category}</Badge>
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="mt-4 text-3xl font-black leading-tight text-avi-ink">{product.name}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-slate-500">({product.reviewCount} reviews)</span>
              </div>
              <div className="mt-6 grid gap-3 rounded-xl border border-border bg-white p-4 shadow-sm sm:grid-cols-2">
                {product.features.map((feature) => (
                  <span key={feature} className="inline-flex items-start gap-2 text-sm text-slate-700">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-avi-teal" aria-hidden="true" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-avi-ink">Description</h2>
            <p className="text-sm leading-7 text-slate-700">{product.longDescription}</p>
            <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <p className="font-bold text-avi-ink">Disclaimer</p>
              <p className="mt-1">
                Product images are for representation. Specifications, compatibility, and availability should be
                confirmed before clinical use or bulk purchase.
              </p>
            </div>
          </div>
        </section>

        <DetailPurchasePanel product={product} />
      </div>

      {similarProducts.length ? (
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Similar Products</p>
              <h2 className="mt-2 text-2xl font-black text-avi-ink">Related NICU Consumables</h2>
            </div>
            <Link href="/products" className="text-sm font-bold text-avi-teal hover:text-avi-tealDark">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
