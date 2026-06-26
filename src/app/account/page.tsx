"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, PackageCheck, RefreshCcw, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomerEmailAuthForm } from "@/components/commerce/customer-email-auth-form";
import { ProductCard } from "@/components/commerce/product-card";
import { products } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { useCustomerStore } from "@/store/customer-store";

export default function AccountPage() {
  const router = useRouter();
  const customer = useCustomerStore((state) => state.customer);
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const orders = useCustomerStore((state) => state.orders);
  const clearCustomer = useCustomerStore((state) => state.logout);

  if (!isLoggedIn || !customer) {
    return (
      <div className="container max-w-xl py-10">
        <CustomerEmailAuthForm mode="login" />
      </div>
    );
  }

  const savedProducts = products.filter((product) => customer.savedProductSlugs.includes(product.slug)).slice(0, 2);
  const recentOrder = orders[0];

  async function logout() {
    await fetch("/api/customer/logout", { method: "POST" }).catch(() => undefined);
    clearCustomer();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">My Account</p>
          <h1 className="mt-2 text-3xl font-black text-avi-ink">Welcome, {customer.fullName}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/account/profile">Edit Profile</Link>
          </Button>
          <Button asChild>
            <Link href="/products">Shop Products</Link>
          </Button>
          <Button type="button" variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard icon={PackageCheck} label="Past orders" value={orders.length.toString()} />
            <SummaryCard icon={MapPin} label="Saved addresses" value={customer.addresses.length.toString()} />
            <SummaryCard icon={RefreshCcw} label="Recently purchased" value={customer.recentlyPurchasedSlugs.length.toString()} />
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-avi-ink">Frequently Purchased</h2>
              <Link href="/account/orders" className="text-sm font-bold text-avi-teal">
                View orders
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {savedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-xl border border-border bg-white p-5 shadow-soft">
            <UserRound className="h-8 w-8 text-avi-teal" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-black text-avi-ink">{customer.hospitalName}</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <span>{customer.mobile}</span>
              <span>{customer.email}</span>
              <span>GST: {customer.gstNumber || "Not added"}</span>
            </div>
          </div>

          {recentOrder ? (
            <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <Badge>{recentOrder.status}</Badge>
              <h2 className="mt-3 text-lg font-black text-avi-ink">{recentOrder.orderNumber}</h2>
              <p className="mt-1 text-sm text-slate-600">{recentOrder.items.length} items</p>
              <p className="mt-3 text-2xl font-black text-avi-ink">{formatCurrency(recentOrder.total)}</p>
              <Button asChild className="mt-4 w-full" variant="secondary">
                <Link href="/account/orders">View Order History</Link>
              </Button>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof PackageCheck; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <Icon className="h-6 w-6 text-avi-teal" aria-hidden="true" />
      <p className="mt-3 text-3xl font-black text-avi-ink">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}
