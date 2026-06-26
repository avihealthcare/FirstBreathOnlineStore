import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getStoreSettings } from "@/lib/catalog";
import { categories, trustNotes } from "@/lib/data";

const policies = [
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms & Conditions", href: "/policies/terms" },
  { label: "Shipping Policy", href: "/policies/shipping" },
  { label: "Return Policy", href: "/policies/returns" }
];

export async function Footer() {
  const settings = await getStoreSettings();

  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-xl font-black text-avi-ink">AVI FirstBreath Store</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Neonatal consumables and disposable items for NICUs, pediatric departments, hospitals, and
            distributors. Built for direct ecommerce and enquiry-based institutional procurement.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-avi-teal" /> {settings.phoneNumber}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-avi-teal" /> {settings.contactEmail}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-avi-teal" /> {settings.companyAddress}
            </span>
          </div>
        </div>

        <div>
          <p className="font-bold text-avi-ink">Categories</p>
          <div className="mt-4 grid gap-2">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.slug} className="text-sm text-slate-600 hover:text-avi-teal" href={`/products?category=${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-bold text-avi-ink">Store</p>
          <div className="mt-4 grid gap-2">
            <Link className="text-sm text-slate-600 hover:text-avi-teal" href="/products">
              All Products
            </Link>
            <Link className="text-sm text-slate-600 hover:text-avi-teal" href="/cart">
              Cart
            </Link>
            <Link className="text-sm text-slate-600 hover:text-avi-teal" href="/checkout">
              Checkout
            </Link>
            <Link className="text-sm text-slate-600 hover:text-avi-teal" href="/account/orders">
              Order History
            </Link>
          </div>
        </div>

        <div>
          <p className="font-bold text-avi-ink">Policies</p>
          <div className="mt-4 grid gap-2">
            {policies.map((policy) => (
              <Link key={policy.href} className="text-sm text-slate-600 hover:text-avi-teal" href={policy.href}>
                {policy.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-y border-border bg-slate-50">
        <div className="container grid gap-3 py-5 text-xs text-slate-600 md:grid-cols-2 lg:grid-cols-4">
          {trustNotes.slice(0, 4).map((note) => (
            <span key={note} className="inline-flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-avi-teal" aria-hidden="true" />
              {note}
            </span>
          ))}
        </div>
      </div>

      <div className="container flex flex-col gap-2 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
        <p>This website does not provide medical advice.</p>
      </div>
    </footer>
  );
}
