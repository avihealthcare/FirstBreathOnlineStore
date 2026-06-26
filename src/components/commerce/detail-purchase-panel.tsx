"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductEnquiryActions } from "@/components/commerce/product-enquiry-actions";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";

export function DetailPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(product.variants[0] ? `${product.variants[0].name}: ${product.variants[0].value}` : "");
  const addItem = useCartStore((state) => state.addItem);
  const price = product.salePrice ?? product.price;

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-soft lg:sticky lg:top-28">
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">{product.availability}</Badge>
        {product.isBestSeller ? <Badge variant="orange">Best seller</Badge> : null}
        {product.isNewArrival ? <Badge>New arrival</Badge> : null}
      </div>

      <div className="mt-5">
        <p className="text-3xl font-black text-avi-ink">{formatCurrency(price)}</p>
        {product.salePrice ? <p className="mt-1 text-sm text-slate-400 line-through">{formatCurrency(product.price)}</p> : null}
        <p className="mt-2 text-xs text-slate-500">SKU: {product.sku}</p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-avi-ink">Variant</span>
          <select
            value={variant}
            onChange={(event) => setVariant(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-avi-teal focus:outline-none focus:ring-2 focus:ring-avi-teal/20"
          >
            {product.variants.map((item) => (
              <option key={item.id} value={`${item.name}: ${item.value}`}>
                {item.name}: {item.value}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-sm font-semibold text-avi-ink">Quantity</span>
          <div className="mt-2 inline-flex h-11 items-center rounded-lg border border-border bg-white">
            <button aria-label="Decrease quantity" className="grid h-11 w-11 place-items-center" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="grid h-11 w-12 place-items-center text-sm font-bold text-avi-ink">{quantity}</span>
            <button aria-label="Increase quantity" className="grid h-11 w-11 place-items-center" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Button onClick={() => addItem(product, quantity, variant)}>
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Add to Cart
        </Button>
        <ProductEnquiryActions product={product} variant={variant} quantity={quantity} />
        <Button asChild variant="secondary">
          <Link href="/products">Continue Browsing</Link>
        </Button>
      </div>

      <div className="mt-6 rounded-lg bg-avi-mist p-4 text-sm text-slate-700">
        <p className="font-bold text-avi-ink">Shipping information</p>
        <p className="mt-2 leading-6">{product.shippingInfo}</p>
        <p className="mt-2 text-xs">Bulk orders may require confirmation of specifications and availability.</p>
      </div>
    </div>
  );
}
