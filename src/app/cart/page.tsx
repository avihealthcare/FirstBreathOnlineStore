"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/commerce/cart-item";
import { PriceSummary } from "@/components/commerce/price-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">My Cart</p>
          <h1 className="mt-2 text-3xl font-black text-avi-ink">Review Items</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </section>
          <PriceSummary items={items} />
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white p-3 shadow-2xl lg:hidden">
            <Button asChild className="w-full">
              <Link href="/checkout">
                <ShoppingCart className="h-4 w-4" />
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Your cart is empty"
          description="Browse neonatal consumables, add items to cart, and continue to OTP-protected checkout."
        />
      )}
    </div>
  );
}
