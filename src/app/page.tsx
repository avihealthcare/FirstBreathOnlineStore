import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, Headphones, HeartPulse, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryCard } from "@/components/commerce/category-card";
import { ProductCard } from "@/components/commerce/product-card";
import { TestimonialCard } from "@/components/commerce/testimonial-card";
import { TrustBadge } from "@/components/commerce/trust-badge";
import { trustNotes } from "@/lib/data";
import { getBulkBanner, getCatalogCategories, getCatalogProducts, getHomepageContent, getTestimonials } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, allProducts, categories, bulkBanner, testimonials] = await Promise.all([
    getHomepageContent(),
    getCatalogProducts(),
    getCatalogCategories(),
    getBulkBanner(),
    getTestimonials()
  ]);
  const featuredProducts = allProducts.filter((product) => product.isFeatured).slice(0, 4);

  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_520px] lg:items-center lg:py-10">
          <div className="max-w-2xl">
            <Badge variant="navy">{hero.eyebrow}</Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight text-avi-ink md:text-5xl">
              {hero.headline}
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">
              {hero.subheadline}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={hero.primaryCtaHref}>
                  {hero.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={hero.secondaryCtaHref}>{hero.secondaryCtaLabel}</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <TrustBadge icon={HeartPulse} title="Hospital-focused" description="Clinical workflows" />
              <TrustBadge icon={BadgeCheck} title="Quality-driven" description="Reliable products" />
              <TrustBadge icon={Truck} title="Fast dispatch" description="Pan India support" />
              <TrustBadge icon={Boxes} title="Bulk support" description="Institutional orders" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border bg-avi-mist shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.image} alt={hero.imageAlt} className="aspect-[16/10] h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur">
              <p className="text-sm font-black text-avi-ink">{hero.calloutTitle}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {hero.calloutText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Featured Products</p>
            <h2 className="mt-2 text-2xl font-black text-avi-ink">Frequently Ordered NICU Consumables</h2>
          </div>
          <Link href="/products" className="hidden text-sm font-bold text-avi-teal hover:text-avi-tealDark sm:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Categories</p>
            <h2 className="mt-2 text-2xl font-black text-avi-ink">Browse by NICU Workflow</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section id="bulk-orders" className="container py-10">
        <div className="grid gap-6 rounded-xl border border-avi-teal/20 bg-avi-mist p-6 shadow-soft md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Badge>{bulkBanner.discountText}</Badge>
            <h2 className="mt-3 text-2xl font-black text-avi-ink">{bulkBanner.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{bulkBanner.subtitle}</p>
          </div>
          <Button asChild>
            <Link href={bulkBanner.ctaHref}>{bulkBanner.ctaLabel}</Link>
          </Button>
        </div>
      </section>

      <section id="trust" className="bg-white py-10">
        <div className="container">
          <div className="mb-5 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Trusted by Healthcare Professionals</p>
            <h2 className="mt-2 text-2xl font-black text-avi-ink">Built for Professional Procurement</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.authorName} testimonial={testimonial} />
            ))}
          </div>
          <div className="mt-8 grid gap-3 rounded-xl border border-border bg-slate-50 p-5 text-xs text-slate-600 md:grid-cols-2 lg:grid-cols-4">
            {trustNotes.slice(0, 4).map((note) => (
              <span key={note} className="inline-flex gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-avi-teal" aria-hidden="true" />
                {note}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-5 rounded-xl border border-border bg-white p-6 shadow-soft md:grid-cols-[1fr_360px] md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Headphones className="h-8 w-8 text-avi-teal" aria-hidden="true" />
              <div>
                <h2 className="text-2xl font-black text-avi-ink">Stay updated on neonatal consumables</h2>
                <p className="mt-1 text-sm text-slate-600">Receive product availability, bulk-order, and launch updates.</p>
              </div>
            </div>
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="hospital@example.com"
              className="h-11 rounded-lg border border-input px-3 text-sm focus:border-avi-teal focus:outline-none focus:ring-2 focus:ring-avi-teal/20"
            />
            <Button type="button">Sign Up</Button>
          </form>
        </div>
      </section>
    </>
  );
}
