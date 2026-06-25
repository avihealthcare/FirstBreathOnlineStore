"use client";

import Link from "next/link";
import { Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OtpLoginForm } from "@/components/commerce/otp-login-form";
import { products } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";

export default function OrdersPage() {
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const orders = useCustomerStore((state) => state.orders);
  const addItem = useCartStore((state) => state.addItem);

  if (!isLoggedIn) {
    return (
      <div className="container max-w-xl py-10">
        <OtpLoginForm />
      </div>
    );
  }

  function repeatOrder(orderId: string) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    order.items.forEach((item) => {
      const product = products.find((candidate) => candidate.slug === item.productSlug);
      if (product) addItem(product, item.quantity, item.variant);
    });
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Account</p>
        <h1 className="mt-2 text-3xl font-black text-avi-ink">Order History</h1>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <Badge>{order.status}</Badge>
                <h2 className="mt-3 text-lg font-black text-avi-ink">{order.orderNumber}</h2>
                <p className="mt-1 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <p className="text-2xl font-black text-avi-ink">{formatCurrency(order.total)}</p>
            </div>

            <div className="mt-5 divide-y divide-border rounded-lg border border-border">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.sku}`} className="flex justify-between gap-3 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-avi-ink">{item.productName}</p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold text-avi-ink">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => repeatOrder(order.id)}>
                <RefreshCcw className="h-4 w-4" />
                Repeat Order
              </Button>
              <Button asChild variant="secondary">
                <Link href={order.invoiceUrl ?? "#"}>
                  <Download className="h-4 w-4" />
                  Invoice Placeholder
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
