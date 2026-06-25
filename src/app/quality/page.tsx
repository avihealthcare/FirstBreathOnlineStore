import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, ShieldCheck, Stethoscope } from "lucide-react";
import { trustNotes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quality",
  description: "Quality, compatibility, and clinical-use notes for AVI FirstBreath Store neonatal consumables."
};

const qualityPillars = [
  {
    icon: BadgeCheck,
    title: "Quality-driven sourcing",
    description: "Products are positioned for hospital procurement workflows where specifications and batch availability are confirmed before use."
  },
  {
    icon: ShieldCheck,
    title: "Compatibility confirmation",
    description: "Clinical and biomedical teams should verify compatibility with devices, patient interfaces, and manufacturer instructions."
  },
  {
    icon: FileCheck2,
    title: "Documentation-ready",
    description: "GST, purchase order, internal notes, and invoice placeholders are built into the buying flow."
  },
  {
    icon: Stethoscope,
    title: "Professional healthcare use",
    description: "The store is intended for hospitals, NICUs, pediatric departments, clinicians, and medical distributors."
  }
];

export default function QualityPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Quality</p>
        <h1 className="mt-2 text-4xl font-black text-avi-ink">Clinical Procurement Confidence</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          AVI FirstBreath Store is designed around careful neonatal consumable selection, compatibility checks, and
          hospital purchase workflows.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {qualityPillars.map((pillar) => (
          <article key={pillar.title} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <pillar.icon className="h-7 w-7 text-avi-teal" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-avi-ink">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-avi-ink">Trust & Compliance Notes</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {trustNotes.map((note) => (
            <p key={note} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-avi-teal" aria-hidden="true" />
              {note}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
