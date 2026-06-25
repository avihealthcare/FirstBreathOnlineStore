"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { CartLine } from "@/types";

export function CartItem({ item }: { item: CartLine }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:grid-cols-[88px_1fr_auto] sm:items-center">
      <Link href={`/products/${item.productSlug}`} className="relative h-22 w-22 overflow-hidden rounded-lg bg-slate-50 sm:h-20 sm:w-20">
        {item.image.startsWith("http") || item.image.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
        ) : (
          <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
        )}
      </Link>
      <div className="min-w-0">
        <Link href={`/products/${item.productSlug}`} className="font-bold text-avi-ink hover:text-avi-teal">
          {item.name}
        </Link>
        <p className="mt-1 text-xs text-slate-500">SKU: {item.sku}</p>
        {item.variant ? <p className="mt-1 text-xs text-slate-600">{item.variant}</p> : null}
        <p className="mt-2 text-sm font-bold text-avi-ink">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="inline-flex h-10 items-center rounded-lg border border-border">
          <button aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="grid h-10 w-10 place-items-center text-sm font-bold">{item.quantity}</span>
          <button aria-label="Increase quantity" className="grid h-10 w-10 place-items-center" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="min-w-20 text-right text-sm font-black text-avi-ink">{formatCurrency(item.price * item.quantity)}</p>
        <Button variant="ghost" size="icon" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>
          <Trash2 className="h-4 w-4 text-red-600" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
