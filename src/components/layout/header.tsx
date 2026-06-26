"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Offers", href: "/#bulk-orders" },
  { label: "Quality", href: "/quality" },
  { label: "Resources", href: "/resources" }
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const setCustomer = useCustomerStore((state) => state.setCustomer);

  useEffect(() => {
    setMounted(true);
    if (isLoggedIn) return;
    fetch("/api/customer/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.customer) setCustomer(data.customer);
      })
      .catch(() => undefined);
  }, [isLoggedIn, setCustomer]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="hidden border-b border-border bg-slate-50 text-xs text-avi-ink lg:block">
        <div className="container flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <span>+91 98765 43210</span>
            <span>sales@avihealthcare.com</span>
            <span>Bulk enquiry support</span>
          </div>
          <span>For hospital, clinical, and professional healthcare use.</span>
        </div>
      </div>

      <div className="container flex min-h-16 items-center gap-3 py-2 lg:min-h-20">
        <button
          aria-label="Open navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-avi-ink lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link href="/" className="flex min-w-0 items-center" aria-label="AVI FirstBreath Store home">
          <Image
            src="/images/logo-firstbreath.png"
            alt="AVI FirstBreath Store"
            width={260}
            height={88}
            className="h-11 w-40 object-contain sm:w-48 lg:h-14 lg:w-56"
            priority
          />
        </Link>

        <form onSubmit={handleSearch} className="relative ml-auto hidden w-full max-w-sm lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for products..."
            className="pl-9"
          />
        </form>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold text-avi-ink transition hover:bg-avi-mist hover:text-avi-teal",
                pathname === item.href && "bg-avi-mist text-avi-teal"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild variant="ghost" size="icon" className="relative ml-auto lg:ml-0" aria-label="Cart">
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {mounted && itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-avi-orange px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </Button>

        <Button asChild variant="secondary" size="sm" className="hidden lg:inline-flex">
          <Link href={isLoggedIn ? "/account" : "/login"}>
            <UserRound className="h-4 w-4" />
            {isLoggedIn ? "Account" : "Login"}
          </Link>
        </Button>
      </div>

      <div className="container pb-3 lg:hidden">
        <form onSubmit={handleSearch} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for products..."
            className="h-10 pl-9"
          />
        </form>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-avi-ink/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="h-full w-[86vw] max-w-sm bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <Image
                src="/images/logo-firstbreath.png"
                alt="AVI FirstBreath Store"
                width={190}
                height={64}
                className="h-11 w-44 object-contain"
              />
              <button
                aria-label="Close navigation"
                className="grid h-10 w-10 place-items-center rounded-lg border border-border"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-6 grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-avi-ink hover:bg-avi-mist"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={isLoggedIn ? "/account" : "/login"}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-avi-teal hover:bg-avi-mist"
              >
                {isLoggedIn ? "My Account" : "Login / Signup"}
              </Link>
            </nav>

            <div className="mt-6 rounded-xl bg-avi-mist p-4">
              <p className="text-sm font-bold text-avi-ink">Browse Categories</p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm text-slate-700 hover:text-avi-teal"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
