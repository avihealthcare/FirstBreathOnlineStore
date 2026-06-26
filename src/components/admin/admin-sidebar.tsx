"use client";

import {
  BarChart3,
  Boxes,
  CreditCard,
  FileSearch,
  FolderTree,
  Home,
  Megaphone,
  MessageSquareQuote,
  PackageCheck,
  Percent,
  Settings,
  Smartphone,
  UsersRound
} from "lucide-react";
import { cn } from "@/lib/utils";

export const adminSections = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "homepage", label: "Homepage", icon: Home },
  { id: "products", label: "Products", icon: Boxes },
  { id: "seo", label: "SEO", icon: FileSearch },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "customers", label: "Customers", icon: UsersRound },
  { id: "orders", label: "Orders", icon: PackageCheck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "coupons", label: "Coupons", icon: Percent },
  { id: "banners", label: "Offers", icon: Megaphone },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "settings", label: "Store Settings", icon: Settings },
  { id: "preview", label: "Preview", icon: Smartphone }
] as const;

export type AdminSection = (typeof adminSections)[number]["id"];

type AdminSidebarProps = {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
};

export function AdminSidebar({ active, onChange }: AdminSidebarProps) {
  return (
    <aside className="rounded-xl border border-border bg-white p-3 shadow-sm lg:sticky lg:top-28">
      <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-avi-teal">Admin Panel</p>
      <div className="mt-2 grid gap-1">
        {adminSections.map((section) => (
          <button
            key={section.id}
            onClick={() => onChange(section.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition",
              active === section.id ? "bg-avi-mist text-avi-teal" : "text-slate-700 hover:bg-slate-50 hover:text-avi-ink"
            )}
          >
            <section.icon className="h-4 w-4" aria-hidden="true" />
            {section.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
