"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, LogOut, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { AdminSection, AdminSidebar } from "@/components/admin/admin-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bulkBanner, testimonials } from "@/lib/data";
import { defaultCoupons, defaultHeroSettings, defaultPaymentOptions } from "@/lib/defaults";
import { formatCurrency } from "@/lib/utils";
import type { AdminProductInput, CategoryInput } from "@/lib/validation";
import type {
  AdminCustomer,
  AdminInitialData,
  AdminOrder,
  Category,
  DiscountCoupon,
  HeroSettings,
  PaymentOption,
  Product
} from "@/types";

type ApiResult<T> = { ok: boolean; error?: string } & T;

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }
  });
  const data = (await response.json().catch(() => ({}))) as ApiResult<T>;
  if (!response.ok || !data.ok) throw new Error(data.error ?? "Request failed.");
  return data;
}

export function AdminPanel({ initialData }: { initialData: AdminInitialData }) {
  const router = useRouter();
  const [active, setActive] = useState<AdminSection>("dashboard");
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [categories, setCategories] = useState<Category[]>(initialData.categories);
  const [customers, setCustomers] = useState<AdminCustomer[]>(initialData.customers);
  const [orders, setOrders] = useState<AdminOrder[]>(initialData.orders);
  const [hero, setHero] = useState<HeroSettings>(initialData.hero);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>(initialData.paymentOptions);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(initialData.coupons);
  const [savedMessage, setSavedMessage] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const stats = useMemo(() => {
    const lowStock = products.filter((product) => product.stockQuantity <= 25);
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingEnquiries: orders.filter((order) => order.status === "Pending").length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
      lowStock,
      recentOrders: orders.slice(0, 5)
    };
  }, [orders, products]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function saveProduct(input: AdminProductInput, existingSlug?: string) {
    const data = await requestJson<{ product: Product }>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({ product: input, existingSlug })
    });
    setProducts((current) => [data.product, ...current.filter((product) => product.slug !== existingSlug && product.slug !== data.product.slug)]);
    setSavedMessage(`${data.product.name} saved to database.`);
  }

  async function deleteProduct(slug: string) {
    await requestJson<{}>(`/api/admin/products/${encodeURIComponent(slug)}`, { method: "DELETE" });
    setProducts((current) => current.filter((product) => product.slug !== slug));
    setSavedMessage("Product deleted from database.");
  }

  async function saveHero(nextHero: HeroSettings) {
    const data = await requestJson<{ hero: HeroSettings }>("/api/admin/homepage", {
      method: "PATCH",
      body: JSON.stringify({ hero: nextHero })
    });
    setHero(data.hero);
    setSavedMessage("Homepage hero saved to database.");
  }

  async function saveCategory(category: CategoryInput) {
    const data = await requestJson<{ category: Category }>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ category })
    });
    setCategories((current) => [data.category, ...current.filter((item) => item.id !== data.category.id)]);
    setSavedMessage(`${data.category.name} category saved.`);
  }

  async function deleteCategory(id: string) {
    await requestJson<{}>(`/api/admin/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
    setCategories((current) => current.filter((category) => category.id !== id));
    setSavedMessage("Category deleted.");
  }

  async function savePaymentOption(option: PaymentOption) {
    const data = await requestJson<{ option: PaymentOption }>("/api/admin/payment-options", {
      method: "POST",
      body: JSON.stringify({ option })
    });
    setPaymentOptions((current) => [data.option, ...current.filter((item) => item.id !== data.option.id)]);
    setSavedMessage(`${data.option.label} payment option saved.`);
  }

  async function deletePaymentOption(id: string) {
    await requestJson<{}>(`/api/admin/payment-options/${encodeURIComponent(id)}`, { method: "DELETE" });
    setPaymentOptions((current) => current.filter((option) => option.id !== id));
    setSavedMessage("Payment option removed.");
  }

  async function saveCoupon(coupon: DiscountCoupon) {
    const data = await requestJson<{ coupon: DiscountCoupon }>("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify({ coupon })
    });
    setCoupons((current) => [data.coupon, ...current.filter((item) => item.id !== data.coupon.id)]);
    setSavedMessage(`${data.coupon.code} coupon saved.`);
  }

  async function deleteCoupon(id: string) {
    await requestJson<{}>(`/api/admin/coupons/${encodeURIComponent(id)}`, { method: "DELETE" });
    setCoupons((current) => current.filter((coupon) => coupon.id !== id));
    setSavedMessage("Coupon deleted.");
  }

  async function updateOrder(id: string, status: AdminOrder["status"], internalNotes: string) {
    const data = await requestJson<{ order: AdminOrder }>(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status, internalNotes })
    });
    setOrders((current) => current.map((order) => (order.id === id ? data.order : order)));
    setSavedMessage(`${data.order.orderNumber} updated.`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <AdminSidebar active={active} onChange={setActive} />
      <section className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">AVI FirstBreath Store</p>
            <h1 className="mt-1 text-2xl font-black text-avi-ink">{adminTitle(active)}</h1>
            {savedMessage ? <p className="mt-2 text-sm font-semibold text-emerald-700">{savedMessage}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/" target="_blank">
                <Eye className="h-4 w-4" />
                Preview Store
              </Link>
            </Button>
            <Button type="button" variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {active === "dashboard" ? <Dashboard stats={stats} customers={customers} /> : null}
        {active === "homepage" ? <HomepageSection hero={hero} onSave={saveHero} /> : null}
        {active === "products" ? (
          <ProductsSection products={products} categories={categories} onSave={saveProduct} onDelete={deleteProduct} />
        ) : null}
        {active === "categories" ? <CategoriesSection categories={categories} onSave={saveCategory} onDelete={deleteCategory} /> : null}
        {active === "customers" ? <CustomersSection customers={customers} /> : null}
        {active === "orders" ? <OrdersSection orders={orders} onUpdate={updateOrder} /> : null}
        {active === "payments" ? (
          <PaymentsSection paymentOptions={paymentOptions} onSave={savePaymentOption} onDelete={deletePaymentOption} />
        ) : null}
        {active === "coupons" ? <CouponsSection coupons={coupons} onSave={saveCoupon} onDelete={deleteCoupon} /> : null}
        {active === "seo" ? <SeoSection products={products} categories={categories} /> : null}
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
    customers: "Customers",
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
  stats,
  customers
}: {
  stats: { totalProducts: number; totalOrders: number; pendingEnquiries: number; revenue: number; lowStock: Product[]; recentOrders: AdminOrder[] };
  customers: AdminCustomer[];
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total Products" value={stats.totalProducts.toString()} />
        <Stat label="Total Orders" value={stats.totalOrders.toString()} />
        <Stat label="Customers" value={customers.length.toString()} />
        <Stat label="Pending Enquiries" value={stats.pendingEnquiries.toString()} />
        <Stat label="Revenue" value={formatCurrency(stats.revenue)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminCard title="Low Stock Products">
          <div className="grid gap-3">
            {stats.lowStock.length ? (
              stats.lowStock.map((product) => (
                <div key={product.slug} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-avi-ink">{product.name}</span>
                  <Badge variant="orange">{product.stockQuantity} left</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No low stock products.</p>
            )}
          </div>
        </AdminCard>
        <AdminCard title="Recent Orders">
          <div className="grid gap-3">
            {stats.recentOrders.length ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-avi-ink">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">{order.customerName}</p>
                  </div>
                  <span className="font-bold text-avi-ink">{formatCurrency(order.total)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No orders yet.</p>
            )}
          </div>
        </AdminCard>
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

function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-avi-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function HomepageSection({ hero, onSave }: { hero: HeroSettings; onSave: (hero: HeroSettings) => Promise<void> }) {
  const [draft, setDraft] = useState(hero);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) {
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

  async function save() {
    setSaving(true);
    await onSave(draft).finally(() => setSaving(false));
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
              <span className="mt-2 text-sm font-semibold text-avi-ink">Upload hero photograph</span>
              <input type="file" accept="image/*" className="sr-only" onChange={handleHeroUpload} />
            </label>
          </div>
        </Field>
        <div className="flex gap-3">
          <Button type="button" onClick={save} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Homepage Hero"}
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
  categories,
  onSave,
  onDelete
}: {
  products: Product[];
  categories: Category[];
  onSave: (product: AdminProductInput, existingSlug?: string) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
}) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [busySlug, setBusySlug] = useState("");

  return (
    <div className="grid gap-5">
      <AdminProductForm
        product={editingProduct}
        categories={categories}
        onSubmitProduct={async (input, existingSlug) => {
          await onSave(input, existingSlug);
          setEditingProduct(null);
        }}
        onCancelEdit={() => setEditingProduct(null)}
      />
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-black text-avi-ink">Current Products</h2>
          <p className="mt-1 text-sm text-slate-600">Products, pictures, variants, SEO details, and category links are saved in the database.</p>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
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
                <tr key={product.id}>
                  <td className="px-4 py-3 font-semibold text-avi-ink">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.images.length}</td>
                  <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(product.salePrice ?? product.price)}</td>
                  <td className="px-4 py-3">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.status === "DRAFT" ? "muted" : "success"}>{product.status ?? "PUBLISHED"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" aria-label={`Edit ${product.name}`} onClick={() => setEditingProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${product.name}`}
                        disabled={busySlug === product.slug}
                        onClick={async () => {
                          setBusySlug(product.slug);
                          await onDelete(product.slug).finally(() => setBusySlug(""));
                        }}
                      >
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

function CategoriesSection({
  categories,
  onSave,
  onDelete
}: {
  categories: Category[];
  onSave: (category: CategoryInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState<CategoryInput>({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
    sortOrder: 0
  });

  function edit(category: Category) {
    setDraft({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image ?? "",
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder ?? 0
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
      <AdminCard title={draft.id ? "Edit Category" : "Add Category"}>
        <div className="grid gap-4">
          <Field label="Category Name">
            <Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          </Field>
          <Field label="Slug">
            <Input value={draft.slug ?? ""} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} />
          </Field>
          <Field label="Description">
            <Textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
          </Field>
          <Field label="Category Image URL">
            <Input value={draft.image ?? ""} onChange={(event) => setDraft((current) => ({ ...current, image: event.target.value }))} />
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold text-avi-ink">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-avi-teal"
              checked={draft.isActive}
              onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))}
            />
            Active category
          </label>
          <Button onClick={() => onSave(draft)}>
            <Save className="h-4 w-4" />
            Save Category
          </Button>
        </div>
      </AdminCard>

      <AdminCard title="Categories">
        <div className="grid gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
              <div>
                <p className="font-semibold text-avi-ink">{category.name}</p>
                <p className="text-xs text-slate-500">{category.count} products</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => edit(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(category.id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function CustomersSection({ customers }: { customers: AdminCustomer[] }) {
  return (
    <AdminCard title="Customers">
      <div className="overflow-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">GST</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Spend</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-avi-ink">{customer.fullName}</p>
                  <p className="text-xs text-slate-500">{customer.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{customer.hospitalName || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{customer.mobile || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{customer.gstNumber || "-"}</td>
                <td className="px-4 py-3">{customer.orderCount}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(customer.totalSpend)}</td>
                <td className="px-4 py-3 text-slate-600">{new Date(customer.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!customers.length ? <p className="p-4 text-sm text-slate-600">No customer accounts yet.</p> : null}
      </div>
    </AdminCard>
  );
}

function OrdersSection({
  orders,
  onUpdate
}: {
  orders: AdminOrder[];
  onUpdate: (id: string, status: AdminOrder["status"], internalNotes: string) => Promise<void>;
}) {
  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <OrderEditor key={order.id} order={order} onUpdate={onUpdate} />
      ))}
      {!orders.length ? <AdminCard title="Orders"><p className="text-sm text-slate-600">No orders placed yet.</p></AdminCard> : null}
    </div>
  );
}

function OrderEditor({
  order,
  onUpdate
}: {
  order: AdminOrder;
  onUpdate: (id: string, status: AdminOrder["status"], internalNotes: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<AdminOrder["status"]>(order.status);
  const [notes, setNotes] = useState(order.internalNotes ?? "");
  const statuses: AdminOrder["status"][] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div>
          <Badge>{order.status}</Badge>
          <h2 className="mt-3 text-xl font-black text-avi-ink">{order.orderNumber}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {order.customerName} · {order.hospitalName || "Hospital not added"} · {order.email}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            {order.items.map((item) => (
              <span key={`${order.id}-${item.sku}`}>
                {item.quantity} x {item.productName} ({formatCurrency(item.total)})
              </span>
            ))}
          </div>
          <p className="mt-4 text-lg font-black text-avi-ink">{formatCurrency(order.total)}</p>
        </div>
        <div>
          <Field label="Order Status">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as AdminOrder["status"])}
              className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm"
            >
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Internal Notes">
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
          </Field>
          <Button className="mt-3 w-full" onClick={() => onUpdate(order.id, status, notes)}>
            Save Order
          </Button>
        </div>
      </div>
    </article>
  );
}

function PaymentsSection({
  paymentOptions,
  onSave,
  onDelete
}: {
  paymentOptions: PaymentOption[];
  onSave: (option: PaymentOption) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PaymentOption>(paymentOptions[0] ?? defaultPaymentOptions[0]);

  function update<K extends keyof PaymentOption>(key: K, value: PaymentOption[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <AdminCard title="Add / Edit Payment Option">
        <div className="grid gap-4">
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
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" checked={draft.isActive} onChange={(event) => update("isActive", event.target.checked)} />
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
      </AdminCard>

      <AdminCard title="Checkout Payment Options">
        <div className="grid gap-3">
          {paymentOptions.map((option) => (
            <div key={option.id} className="rounded-lg bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant={option.isActive ? "success" : "muted"}>{option.isActive ? "Active" : "Hidden"}</Badge>
                  <h3 className="mt-2 font-black text-avi-ink">{option.label}</h3>
                  <p className="mt-1 text-sm text-slate-600">{option.description}</p>
                  {option.bankName ? <p className="mt-2 text-xs text-slate-500">{option.bankName} · {option.accountName} · {option.ifsc}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setDraft(option)}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => onSave({ ...option, isActive: !option.isActive })}>{option.isActive ? "Hide" : "Show"}</Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(option.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function CouponsSection({
  coupons,
  onSave,
  onDelete
}: {
  coupons: DiscountCoupon[];
  onSave: (coupon: DiscountCoupon) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState<DiscountCoupon>(coupons[0] ?? defaultCoupons[0]);

  function update<K extends keyof DiscountCoupon>(key: K, value: DiscountCoupon[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <AdminCard title="Add / Edit Discount Coupon">
        <div className="grid gap-4">
          <Field label="Coupon Code">
            <Input value={draft.code} onChange={(event) => update("code", event.target.value.toUpperCase())} />
          </Field>
          <Field label="Description">
            <Textarea value={draft.description} onChange={(event) => update("description", event.target.value)} />
          </Field>
          <Field label="Discount Type">
            <select value={draft.type} onChange={(event) => update("type", event.target.value as DiscountCoupon["type"])} className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm">
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
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" checked={draft.isActive} onChange={(event) => update("isActive", event.target.checked)} />
            Active coupon
          </label>
          <Button onClick={() => onSave(draft)}>Save Coupon</Button>
        </div>
      </AdminCard>

      <AdminCard title="Available Coupons">
        <div className="grid gap-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="rounded-lg bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant={coupon.isActive ? "success" : "muted"}>{coupon.isActive ? "Active" : "Hidden"}</Badge>
                  <h3 className="mt-2 font-black text-avi-ink">{coupon.code}</h3>
                  <p className="mt-1 text-sm text-slate-600">{coupon.description}</p>
                  <p className="mt-2 text-xs font-semibold text-avi-teal">
                    {coupon.type === "percentage" ? `${coupon.value}% off` : `${formatCurrency(coupon.value)} off`} · Min order {formatCurrency(coupon.minOrderValue)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setDraft(coupon)}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => onSave({ ...coupon, isActive: !coupon.isActive })}>{coupon.isActive ? "Hide" : "Show"}</Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(coupon.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function SeoSection({ products, categories }: { products: Product[]; categories: Category[] }) {
  return (
    <AdminCard title="SEO Setup">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product SEO Coverage">
          <Input readOnly value={`${products.length} products available for product-level SEO`} />
        </Field>
        <Field label="Category SEO Coverage">
          <Input readOnly value={`${categories.length} categories available for category-level SEO`} />
        </Field>
        <Field label="Canonical Domain">
          <Input placeholder="https://firstbreath.avihealthcare.com" />
        </Field>
        <Field label="Open Graph Default Image">
          <Input placeholder="/images/hero-nicu.png" />
        </Field>
      </div>
      <p className="mt-4 text-sm text-slate-600">Product SEO title and meta description save with each product from Product Management.</p>
    </AdminCard>
  );
}

function BannersSection() {
  return (
    <AdminCard title="Offers & Banners">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Banner Title"><Input defaultValue={bulkBanner.title} /></Field>
        <Field label="CTA Label"><Input defaultValue={bulkBanner.ctaLabel} /></Field>
        <Field label="Discount Text"><Input defaultValue={bulkBanner.discountText} /></Field>
        <Field label="CTA Link"><Input defaultValue={bulkBanner.ctaHref} /></Field>
        <Field label="Subtitle"><Textarea defaultValue={bulkBanner.subtitle} /></Field>
      </div>
      <Button className="mt-4 w-fit" disabled>Banner Save Coming Soon</Button>
    </AdminCard>
  );
}

function TestimonialsSection() {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <AdminCard title="Add Testimonial">
        <div className="grid gap-4">
          <Field label="Author Name"><Input defaultValue="Dr. Ramesh Kumar" /></Field>
          <Field label="Author Title"><Input defaultValue="Neonatologist" /></Field>
          <Field label="Hospital"><Input defaultValue="Sunrise Children's Hospital" /></Field>
          <Field label="Quote"><Textarea defaultValue={testimonials[0]?.quote} /></Field>
          <Button disabled>Save Testimonial Coming Soon</Button>
        </div>
      </AdminCard>
      <AdminCard title="Published Testimonials">
        <div className="grid gap-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.authorName} className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-700">{testimonial.quote}</p>
              <p className="mt-3 text-sm font-bold text-avi-ink">{testimonial.authorName}</p>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function SettingsSection() {
  return (
    <AdminCard title="Store Settings">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company Name"><Input defaultValue="AVI Healthcare Pvt Ltd" /></Field>
        <Field label="Contact Email"><Input defaultValue="sales@avihealthcare.com" /></Field>
        <Field label="Phone Number"><Input defaultValue="+91 98765 43210" /></Field>
        <Field label="WhatsApp Number"><Input defaultValue="+91 98765 43210" /></Field>
        <Field label="GST Number"><Input defaultValue="GST placeholder" /></Field>
        <Field label="Company Address"><Textarea defaultValue="AVI Healthcare Pvt Ltd, India" /></Field>
        <Field label="Privacy Policy"><Textarea defaultValue="Customer and order data should be handled according to privacy and data protection best practices." /></Field>
        <Field label="Terms and Conditions"><Textarea defaultValue="Product specifications, compatibility, and availability should be confirmed before purchase." /></Field>
        <Field label="Shipping Policy"><Textarea defaultValue="Dispatch timelines depend on stock status and order confirmation." /></Field>
        <Field label="Return Policy"><Textarea defaultValue="Returns are subject to product condition, batch, and procurement terms." /></Field>
      </div>
      <Button className="mt-4 w-fit" disabled>Settings Save Coming Soon</Button>
    </AdminCard>
  );
}

function PreviewSection({ mode, setMode }: { mode: "desktop" | "mobile"; setMode: (mode: "desktop" | "mobile") => void }) {
  return (
    <AdminCard title="Preview Store">
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-border bg-slate-50 p-1">
          <button className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "desktop" ? "bg-white text-avi-teal shadow-sm" : "text-slate-600"}`} onClick={() => setMode("desktop")}>Desktop</button>
          <button className={`rounded-md px-4 py-2 text-sm font-semibold ${mode === "mobile" ? "bg-white text-avi-teal shadow-sm" : "text-slate-600"}`} onClick={() => setMode("mobile")}>Mobile</button>
        </div>
      </div>
      <div className="mt-5 overflow-auto rounded-xl bg-slate-100 p-4">
        <iframe
          title="AVI FirstBreath Store preview"
          src="/"
          className={mode === "desktop" ? "h-[620px] w-full rounded-lg border border-border bg-white" : "mx-auto h-[640px] w-[375px] rounded-[28px] border-8 border-slate-900 bg-white"}
        />
      </div>
    </AdminCard>
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
