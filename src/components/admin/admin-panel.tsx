"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { AdminSection, AdminSidebar } from "@/components/admin/admin-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bulkBanner, categories, mockOrders, testimonials } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { defaultCoupons, defaultHeroSettings, defaultPaymentOptions, useAdminStore } from "@/store/admin-store";
import type { AdminProductInput } from "@/lib/validation";
import type { DiscountCoupon, HeroSettings, PaymentOption, Product } from "@/types";

export function AdminPanel() {
  const router = useRouter();
  const [active, setActive] = useState<AdminSection>("dashboard");
  const products = useAdminStore((state) => state.products);
  const saveProduct = useAdminStore((state) => state.saveProduct);
  const deleteProduct = useAdminStore((state) => state.deleteProduct);
  const hero = useAdminStore((state) => state.hero);
  const updateHero = useAdminStore((state) => state.updateHero);
  const paymentOptions = useAdminStore((state) => state.paymentOptions);
  const savePaymentOption = useAdminStore((state) => state.savePaymentOption);
  const deletePaymentOption = useAdminStore((state) => state.deletePaymentOption);
  const coupons = useAdminStore((state) => state.coupons);
  const saveCoupon = useAdminStore((state) => state.saveCoupon);
  const deleteCoupon = useAdminStore((state) => state.deleteCoupon);
  const resetStoreSettings = useAdminStore((state) => state.resetStoreSettings);
  const [savedMessage, setSavedMessage] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const stats = useMemo(() => {
    const revenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const lowStock = products.filter((product) => product.stockQuantity <= 25);
    return {
      totalProducts: products.length,
      totalOrders: mockOrders.length,
      pendingEnquiries: mockOrders.filter((order) => order.status === "Pending").length + 3,
      revenue,
      lowStock
    };
  }, [products]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <AdminSidebar active={active} onChange={setActive} />
      <section className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">AVI FirstBreath Store</p>
            <h1 className="mt-1 text-2xl font-black text-avi-ink">{adminTitle(active)}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/" target="_blank">
                <Eye className="h-4 w-4" />
                Preview Store
              </Link>
            </Button>
            <Button type="button" variant="secondary" onClick={resetStoreSettings}>
              Reset MVP Data
            </Button>
            <Button type="button" variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {active === "dashboard" ? <Dashboard stats={stats} /> : null}
        {active === "homepage" ? <HomepageSection hero={hero} onSave={updateHero} /> : null}
        {active === "products" ? (
          <ProductsSection
            products={products}
            savedMessage={savedMessage}
            onSave={(input, existingSlug) => {
              const saved = saveProduct(input, existingSlug);
              setSavedMessage(`${saved.name} saved. The product catalogue is updated in this browser session.`);
            }}
            onDelete={(slug) => {
              deleteProduct(slug);
              setSavedMessage("Product deleted from the MVP catalogue.");
            }}
          />
        ) : null}
        {active === "seo" ? <SeoSection /> : null}
        {active === "categories" ? <CategoriesSection /> : null}
        {active === "orders" ? <OrdersSection /> : null}
        {active === "payments" ? (
          <PaymentsSection
            paymentOptions={paymentOptions}
            onSave={savePaymentOption}
            onDelete={deletePaymentOption}
          />
        ) : null}
        {active === "coupons" ? <CouponsSection coupons={coupons} onSave={saveCoupon} onDelete={deleteCoupon} /> : null}
        {active === "banners" ? <BannersSection /> : null}
        {active === "testimonials" ? <TestimonialsSection /> : null}
        {active === "settings" ? <SettingsSection /> : null}
        {active === "preview" ? <PreviewSection mode={previewMode} setMode={setPreviewMode} /> : null}
      </section>
    </div>
  );
}

function adminTitle(section: AdminSection) {
  const titles: Record<AdminSection, string> = {
    dashboard: "Dashboard",
    homepage: "Homepage Content",
    products: "Product Management",
    seo: "SEO Setup",
    categories: "Category Management",
    orders: "Order Management",
    payments: "Payment Options",
    coupons: "Discount Coupons",
    banners: "Offers & Banners",
    testimonials: "Testimonials",
    settings: "Store Settings",
    preview: "Store Preview"
  };
  return titles[section];
}

function Dashboard({
  stats
}: {
  stats: { totalProducts: number; totalOrders: number; pendingEnquiries: number; revenue: number; lowStock: Product[] };
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Products" value={stats.totalProducts.toString()} />
        <Stat label="Total Orders" value={stats.totalOrders.toString()} />
        <Stat label="Pending Enquiries" value={stats.pendingEnquiries.toString()} />
        <Stat label="Revenue Placeholder" value={formatCurrency(stats.revenue)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-avi-ink">Low Stock Products</h2>
          <div className="mt-4 grid gap-3">
            {stats.lowStock.map((product) => (
              <div key={product.slug} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                <span className="font-semibold text-avi-ink">{product.name}</span>
                <Badge variant="orange">{product.stockQuantity} left</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-avi-ink">Recent Orders</h2>
          <div className="mt-4 grid gap-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                <div>
                  <p className="font-semibold text-avi-ink">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{order.items.length} items</p>
                </div>
                <span className="font-bold text-avi-ink">{formatCurrency(order.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-black text-avi-ink">{value}</p>
    </div>
  );
}

function HomepageSection({ hero, onSave }: { hero: HeroSettings; onSave: (hero: HeroSettings) => void }) {
  const [draft, setDraft] = useState(hero);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) {
    setSaved(false);
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleHeroUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") update("image", reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <div className="grid gap-5 rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Homepage Hero</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <Input value={draft.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} />
          </Field>
          <Field label="Hero Image Alt Text">
            <Input value={draft.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} />
          </Field>
          <Field label="Headline">
            <Textarea value={draft.headline} onChange={(event) => update("headline", event.target.value)} />
          </Field>
          <Field label="Subheadline">
            <Textarea value={draft.subheadline} onChange={(event) => update("subheadline", event.target.value)} />
          </Field>
          <Field label="Primary CTA Label">
            <Input value={draft.primaryCtaLabel} onChange={(event) => update("primaryCtaLabel", event.target.value)} />
          </Field>
          <Field label="Primary CTA Link">
            <Input value={draft.primaryCtaHref} onChange={(event) => update("primaryCtaHref", event.target.value)} />
          </Field>
          <Field label="Secondary CTA Label">
            <Input value={draft.secondaryCtaLabel} onChange={(event) => update("secondaryCtaLabel", event.target.value)} />
          </Field>
          <Field label="Secondary CTA Link">
            <Input value={draft.secondaryCtaHref} onChange={(event) => update("secondaryCtaHref", event.target.value)} />
          </Field>
          <Field label="Callout Title">
            <Input value={draft.calloutTitle} onChange={(event) => update("calloutTitle", event.target.value)} />
          </Field>
          <Field label="Callout Text">
            <Input value={draft.calloutText} onChange={(event) => update("calloutText", event.target.value)} />
          </Field>
        </div>
        <Field label="Hero Photograph">
          <div className="grid gap-3 rounded-lg bg-slate-50 p-4">
            <Input value={draft.image} onChange={(event) => update("image", event.target.value)} />
            <label className="grid min-h-24 cursor-pointer place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-avi-teal">
              <Plus className="h-6 w-6 text-avi-teal" aria-hidden="true" />
              <span className="mt-2 text-sm font-semibold text-avi-ink">Upload hero photograph for MVP preview</span>
              <input type="file" accept="image/*" className="sr-only" onChange={handleHeroUpload} />
            </label>
          </div>
        </Field>
        {saved ? <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Homepage hero saved.</p> : null}
        <div className="flex gap-3">
          <Button
            onClick={() => {
              onSave(draft);
              setSaved(true);
            }}
          >
            Save Homepage Hero
          </Button>
          <Button type="button" variant="secondary" onClick={() => setDraft(defaultHeroSettings)}>
            Reset Hero
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-soft">
        <p className="mb-3 text-sm font-bold text-avi-ink">Hero Preview</p>
        <div className="overflow-hidden rounded-xl border border-border bg-avi-mist">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.image} alt={draft.imageAlt} className="aspect-[16/10] w-full object-cover" />
          <div className="p-4">
            <Badge variant="navy">{draft.eyebrow}</Badge>
            <h3 className="mt-3 text-xl font-black text-avi-ink">{draft.headline}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{draft.subheadline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsSection({
  products,
  savedMessage,
  onSave,
  onDelete
}: {
  products: Product[];
  savedMessage: string;
  onSave: (product: AdminProductInput, existingSlug?: string) => void;
  onDelete: (slug: string) => void;
}) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div className="grid gap-5">
      <AdminProductForm
        product={editingProduct}
        onSubmitProduct={(input, existingSlug) => {
          onSave(input, existingSlug);
          setEditingProduct(null);
        }}
        onCancelEdit={() => setEditingProduct(null)}
      />
      {savedMessage ? <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{savedMessage}</p> : null}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-black text-avi-ink">Product List</h2>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Pictures</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.slug}>
                  <td className="px-4 py-3 font-semibold text-avi-ink">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.images.length}</td>
                  <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(product.salePrice ?? product.price)}</td>
                  <td className="px-4 py-3">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <Badge variant="success">Published</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" aria-label={`Edit ${product.name}`} onClick={() => setEditingProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label={`Delete ${product.name}`} onClick={() => onDelete(product.slug)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SeoSection() {
  return (
    <div className="grid gap-5 rounded-xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-avi-ink">SEO Fields by Product, Category, or Page</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Entity Type">
          <select className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm">
            <option>Product</option>
            <option>Category</option>
            <option>Page</option>
          </select>
        </Field>
        <Field label="Slug">
          <Input defaultValue="neonatal-breathing-circuit" />
        </Field>
        <Field label="SEO Title">
          <Input defaultValue="Neonatal Breathing Circuit | AVI FirstBreath Store" />
        </Field>
        <Field label="Meta Description">
          <Input defaultValue="Buy neonatal breathing circuits for NICU respiratory support workflows." />
        </Field>
        <Field label="Keywords">
          <Input defaultValue="neonatal breathing circuit, NICU consumables, CPAP" />
        </Field>
        <Field label="Open Graph Image">
          <Input defaultValue="/images/products/neonatal-breathing-circuit.png" />
        </Field>
        <Field label="Canonical URL">
          <Input placeholder="https://firstbreath.avihealthcare.com/products/neonatal-breathing-circuit" />
        </Field>
        <label className="mt-8 flex items-center gap-2 text-sm font-semibold text-avi-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" defaultChecked />
          Index this page
        </label>
      </div>
      <Button className="w-fit">Save SEO Settings</Button>
    </div>
  );
}

function CategoriesSection() {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Add Category</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Category Name">
            <Input defaultValue="Breathing Circuits" />
          </Field>
          <Field label="Category Description">
            <Textarea defaultValue="Disposable circuits and connectors for neonatal respiratory support." />
          </Field>
          <Field label="Category Image">
            <Input defaultValue="/images/products/neonatal-breathing-circuit.png" />
          </Field>
          <Field label="Category SEO">
            <Input defaultValue="Breathing circuits for NICU use" />
          </Field>
          <Button>Save Category</Button>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Categories</h2>
        <div className="mt-4 grid gap-3">
          {categories.map((category) => (
            <div key={category.slug} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
              <div>
                <p className="font-semibold text-avi-ink">{category.name}</p>
                <p className="text-xs text-slate-500">{category.count} products</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersSection() {
  const [status, setStatus] = useState("Pending");

  return (
    <div className="grid gap-4">
      {mockOrders.map((order) => (
        <article key={order.id} className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <Badge>{status}</Badge>
              <h2 className="mt-3 text-xl font-black text-avi-ink">{order.orderNumber}</h2>
              <p className="mt-1 text-sm text-slate-600">Customer details, order items, and procurement notes are visible here.</p>
              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                {order.items.map((item) => (
                  <span key={item.sku}>
                    {item.quantity} × {item.productName}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="status">Order Status</Label>
              <select
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-input bg-white px-3 text-sm"
              >
                {["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <Label htmlFor="notes" className="mt-4 block">
                Internal Notes
              </Label>
              <Textarea id="notes" className="mt-2" defaultValue="Confirm availability and GST details before dispatch." />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function PaymentsSection({
  paymentOptions,
  onSave,
  onDelete
}: {
  paymentOptions: PaymentOption[];
  onSave: (option: PaymentOption) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<PaymentOption>(defaultPaymentOptions[0]);

  function update<K extends keyof PaymentOption>(key: K, value: PaymentOption[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Add / Edit Payment Option</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Payment ID">
            <Input value={draft.id} onChange={(event) => update("id", event.target.value)} placeholder="bank-transfer" />
          </Field>
          <Field label="Label">
            <Input value={draft.label} onChange={(event) => update("label", event.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea value={draft.description} onChange={(event) => update("description", event.target.value)} />
          </Field>
          <label className="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm font-semibold text-avi-ink">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-avi-teal"
              checked={draft.isActive}
              onChange={(event) => update("isActive", event.target.checked)}
            />
            Active at checkout
          </label>
          <div className="rounded-lg bg-avi-mist p-4">
            <p className="mb-3 text-sm font-black text-avi-ink">Bank Details</p>
            <div className="grid gap-3">
              <Input placeholder="Bank Name" value={draft.bankName ?? ""} onChange={(event) => update("bankName", event.target.value)} />
              <Input placeholder="Account Name" value={draft.accountName ?? ""} onChange={(event) => update("accountName", event.target.value)} />
              <Input placeholder="Account Number" value={draft.accountNumber ?? ""} onChange={(event) => update("accountNumber", event.target.value)} />
              <Input placeholder="IFSC" value={draft.ifsc ?? ""} onChange={(event) => update("ifsc", event.target.value)} />
              <Input placeholder="Branch" value={draft.branch ?? ""} onChange={(event) => update("branch", event.target.value)} />
              <Textarea placeholder="Payment instructions" value={draft.instructions ?? ""} onChange={(event) => update("instructions", event.target.value)} />
            </div>
          </div>
          <Button onClick={() => onSave(draft)}>Save Payment Option</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Checkout Payment Options</h2>
        <div className="mt-4 grid gap-3">
          {paymentOptions.map((option) => (
            <div key={option.id} className="rounded-lg bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant={option.isActive ? "success" : "muted"}>{option.isActive ? "Active" : "Hidden"}</Badge>
                  <h3 className="mt-2 font-black text-avi-ink">{option.label}</h3>
                  <p className="mt-1 text-sm text-slate-600">{option.description}</p>
                  {option.bankName ? (
                    <p className="mt-2 text-xs text-slate-500">
                      {option.bankName} · {option.accountName} · {option.ifsc}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setDraft(option)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onSave({ ...option, isActive: !option.isActive })}>
                    {option.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(option.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CouponsSection({
  coupons,
  onSave,
  onDelete
}: {
  coupons: DiscountCoupon[];
  onSave: (coupon: DiscountCoupon) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<DiscountCoupon>(defaultCoupons[0]);

  function update<K extends keyof DiscountCoupon>(key: K, value: DiscountCoupon[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Add / Edit Discount Coupon</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Coupon Code">
            <Input value={draft.code} onChange={(event) => update("code", event.target.value.toUpperCase())} />
          </Field>
          <Field label="Description">
            <Textarea value={draft.description} onChange={(event) => update("description", event.target.value)} />
          </Field>
          <Field label="Discount Type">
            <select
              value={draft.type}
              onChange={(event) => update("type", event.target.value as DiscountCoupon["type"])}
              className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </Field>
          <Field label="Discount Value">
            <Input type="number" value={draft.value} onChange={(event) => update("value", Number(event.target.value))} />
          </Field>
          <Field label="Minimum Order Value">
            <Input type="number" value={draft.minOrderValue} onChange={(event) => update("minOrderValue", Number(event.target.value))} />
          </Field>
          <label className="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm font-semibold text-avi-ink">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-avi-teal"
              checked={draft.isActive}
              onChange={(event) => update("isActive", event.target.checked)}
            />
            Active coupon
          </label>
          <Button onClick={() => onSave(draft)}>Save Coupon</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Available Coupons</h2>
        <div className="mt-4 grid gap-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="rounded-lg bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant={coupon.isActive ? "success" : "muted"}>{coupon.isActive ? "Active" : "Hidden"}</Badge>
                  <h3 className="mt-2 font-black text-avi-ink">{coupon.code}</h3>
                  <p className="mt-1 text-sm text-slate-600">{coupon.description}</p>
                  <p className="mt-2 text-xs font-semibold text-avi-teal">
                    {coupon.type === "percentage" ? `${coupon.value}% off` : `${formatCurrency(coupon.value)} off`} · Min order{" "}
                    {formatCurrency(coupon.minOrderValue)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setDraft(coupon)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onSave({ ...coupon, isActive: !coupon.isActive })}>
                    {coupon.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(coupon.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BannersSection() {
  return (
    <div className="grid gap-5 rounded-xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-avi-ink">Homepage Offer Banner</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Banner Title">
          <Input defaultValue={bulkBanner.title} />
        </Field>
        <Field label="CTA Label">
          <Input defaultValue={bulkBanner.ctaLabel} />
        </Field>
        <Field label="Discount Text">
          <Input defaultValue={bulkBanner.discountText} />
        </Field>
        <Field label="CTA Link">
          <Input defaultValue={bulkBanner.ctaHref} />
        </Field>
        <Field label="Subtitle">
          <Textarea defaultValue={bulkBanner.subtitle} />
        </Field>
        <label className="mt-8 flex items-center gap-2 text-sm font-semibold text-avi-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" defaultChecked />
          Active banner
        </label>
      </div>
      <Button className="w-fit">Save Banner</Button>
    </div>
  );
}

function TestimonialsSection() {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Add Testimonial</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Author Name">
            <Input defaultValue="Dr. Ramesh Kumar" />
          </Field>
          <Field label="Author Title">
            <Input defaultValue="Neonatologist" />
          </Field>
          <Field label="Hospital">
            <Input defaultValue="Sunrise Children's Hospital" />
          </Field>
          <Field label="Quote">
            <Textarea defaultValue={testimonials[0].quote} />
          </Field>
          <Button>Save Testimonial</Button>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-avi-ink">Published Testimonials</h2>
        <div className="mt-4 grid gap-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.authorName} className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-700">{testimonial.quote}</p>
              <p className="mt-3 text-sm font-bold text-avi-ink">{testimonial.authorName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="grid gap-5 rounded-xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-avi-ink">Store Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company Name">
          <Input defaultValue="AVI Healthcare Pvt Ltd" />
        </Field>
        <Field label="Contact Email">
          <Input defaultValue="sales@avihealthcare.com" />
        </Field>
        <Field label="Phone Number">
          <Input defaultValue="+91 98765 43210" />
        </Field>
        <Field label="WhatsApp Number">
          <Input defaultValue="+91 98765 43210" />
        </Field>
        <Field label="GST Number">
          <Input defaultValue="GST placeholder" />
        </Field>
        <Field label="Social Links">
          <Input placeholder="LinkedIn, YouTube, Instagram" />
        </Field>
        <Field label="Company Address">
          <Textarea defaultValue="AVI Healthcare Pvt Ltd, India" />
        </Field>
        <Field label="Footer Text">
          <Textarea defaultValue="For hospital, clinical, and professional healthcare use." />
        </Field>
        <Field label="Privacy Policy">
          <Textarea defaultValue="Customer and order data should be handled according to privacy and data protection best practices." />
        </Field>
        <Field label="Terms and Conditions">
          <Textarea defaultValue="Product specifications, compatibility, and availability should be confirmed before purchase." />
        </Field>
        <Field label="Shipping Policy">
          <Textarea defaultValue="Dispatch timelines depend on stock status and order confirmation." />
        </Field>
        <Field label="Return Policy">
          <Textarea defaultValue="Returns are subject to product condition, batch, and procurement terms." />
        </Field>
      </div>
      <Button className="w-fit">Save Store Settings</Button>
    </div>
  );
}

function PreviewSection({ mode, setMode }: { mode: "desktop" | "mobile"; setMode: (mode: "desktop" | "mobile") => void }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-avi-ink">Preview Store</h2>
          <p className="text-sm text-slate-600">Switch between desktop and mobile preview frames.</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-slate-50 p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "desktop" ? "bg-white text-avi-teal shadow-sm" : "text-slate-600"}`}
            onClick={() => setMode("desktop")}
          >
            Desktop
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "mobile" ? "bg-white text-avi-teal shadow-sm" : "text-slate-600"}`}
            onClick={() => setMode("mobile")}
          >
            Mobile
          </button>
        </div>
      </div>
      <div className="mt-5 overflow-auto rounded-xl bg-slate-100 p-4">
        <iframe
          title="AVI FirstBreath Store preview"
          src="/"
          className={mode === "desktop" ? "h-[620px] w-full rounded-lg border border-border bg-white" : "mx-auto h-[640px] w-[375px] rounded-[28px] border-8 border-slate-900 bg-white"}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
