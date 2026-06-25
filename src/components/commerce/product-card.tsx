"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const saveProduct = useCustomerStore((state) => state.saveProduct);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:border-avi-teal hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] bg-slate-50">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          {product.images[0]?.startsWith("http") || product.images[0]?.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105" />
          ) : (
            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-5 transition duration-300 group-hover:scale-105" />
          )}
        </Link>
        <button
          aria-label={`Save ${product.name}`}
          onClick={() => saveProduct(product.slug)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-white/90 text-avi-ink transition hover:border-avi-teal hover:text-avi-teal"
          title="Save product"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
        </button>
        {product.isNewArrival ? <Badge className="absolute left-3 top-3">New</Badge> : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="navy">{product.category}</Badge>
          {product.tags.slice(0, 1).map((tag) => (
            <Badge key={tag} variant="muted">
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/products/${product.slug}`} className="mt-3 line-clamp-2 text-sm font-bold text-avi-ink hover:text-avi-teal">
          {product.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{product.shortDescription}</p>

        <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
          <span>({product.reviewCount})</span>
          <span className="ml-auto font-semibold text-emerald-700">{product.availability}</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-black text-avi-ink">{formatCurrency(product.salePrice ?? product.price)}</p>
            {product.salePrice ? <p className="text-xs text-slate-400 line-through">{formatCurrency(product.price)}</p> : null}
          </div>
          <Button size="icon" aria-label={`Add ${product.name} to cart`} onClick={() => addItem(product)}>
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
