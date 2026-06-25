import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileText, HelpCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources",
  description: "Resources, policies, and procurement guidance for AVI FirstBreath Store customers."
};

const resources = [
  {
    title: "Product Compatibility",
    description: "Confirm product specifications, connector compatibility, and manufacturer instructions before clinical use.",
    href: "/quality",
    icon: ShieldCheck
  },
  {
    title: "Privacy Policy",
    description: "How customer and order data should be handled for the store.",
    href: "/policies/privacy",
    icon: FileText
  },
  {
    title: "Shipping Policy",
    description: "Dispatch, shipping, and bulk order timing expectations.",
    href: "/policies/shipping",
    icon: BookOpenCheck
  },
  {
    title: "Support Workflow",
    description: "Use checkout notes, purchase order method, or order history for procurement follow-up.",
    href: "/account/orders",
    icon: HelpCircle
  }
];

export default function ResourcesPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Resources</p>
        <h1 className="mt-2 text-4xl font-black text-avi-ink">Hospital Buying Resources</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Quick access to quality notes, policy pages, and procurement-friendly guidance for neonatal consumables.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <Link
            key={resource.title}
            href={resource.href}
            className="group rounded-xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-avi-teal hover:shadow-lift"
          >
            <resource.icon className="h-7 w-7 text-avi-teal" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-avi-ink">{resource.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-avi-teal">
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
