import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateCartTotals, formatCurrency } from "@/lib/utils";
import type { CartLine } from "@/types";

type PriceSummaryProps = {
  items: CartLine[];
  checkoutHref?: string;
  checkoutLabel?: string;
};

export function PriceSummary({ items, checkoutHref = "/checkout", checkoutLabel = "Proceed to Checkout" }: PriceSummaryProps) {
  const totals = calculateCartTotals(items);

  return (
    <aside className="rounded-xl border border-border bg-white p-5 shadow-soft">
      <h2 className="text-lg font-black text-avi-ink">Order Summary</h2>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold text-avi-ink">{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Tax (5%)</span>
          <span className="font-semibold text-avi-ink">{formatCurrency(totals.tax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Shipping</span>
          <span className="font-semibold text-avi-ink">{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-base">
            <span className="font-black text-avi-ink">Total</span>
            <span className="font-black text-avi-ink">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>
      <Button asChild className="mt-5 w-full" disabled={items.length === 0}>
        <Link href={checkoutHref}>{checkoutLabel}</Link>
      </Button>
      <Button asChild variant="secondary" className="mt-3 w-full">
        <Link href="/products">Continue Shopping</Link>
      </Button>
      <div className="mt-5 grid gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-avi-teal" aria-hidden="true" />
          Secure checkout placeholder
        </span>
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-avi-teal" aria-hidden="true" />
          GST invoice placeholder
        </span>
      </div>
    </aside>
  );
}
