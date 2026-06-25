import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-avi-teal hover:shadow-lift"
    >
      <span className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-50">
        <Image src={category.image ?? "/images/products/neonatal-breathing-circuit.png"} alt="" fill className="object-contain p-2" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-avi-ink">{category.name}</span>
        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">{category.description}</span>
        <span className="mt-2 block text-xs font-semibold text-avi-teal">{category.count} products</span>
      </span>
      <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-avi-teal" aria-hidden="true" />
    </Link>
  );
}
