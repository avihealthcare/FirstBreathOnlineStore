"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminProductSchema, type AdminProductInput } from "@/lib/validation";
import { productToAdminInput } from "@/store/admin-store";
import type { Category, Product } from "@/types";

type AdminProductFormProps = {
  product?: Product | null;
  categories: Category[];
  onSubmitProduct: (product: AdminProductInput, existingSlug?: string) => Promise<void> | void;
  onCancelEdit?: () => void;
};

const blankProductValues: AdminProductInput = {
  name: "Neonatal Breathing Circuit",
  slug: "neonatal-breathing-circuit",
  sku: "AVI-FB-BC-001",
  price: 1250,
  salePrice: 0,
  category: "Breathing Circuits",
  categorySlug: "breathing-circuits",
  tags: "CPAP, Sterile, NICU",
  imageUrls: "/images/products/neonatal-breathing-circuit.png",
  features: "Medical-grade material\nStandard connectors\nReady for clinical workflow",
  variants: "Size: Neonatal\nPack Type: Single\nSterility: Sterile",
  similarProducts: "infant-cpap-nasal-prongs, neonatal-cpap-mask",
  availability: "In stock",
  shortDescription: "Medical-grade neonatal breathing circuit with soft tubing.",
  longDescription:
    "Designed for hospital, clinical, and professional healthcare use. Compatibility should be verified before order confirmation.",
  stockQuantity: 50,
  shippingDetails: "Dispatch estimate 2-5 working days.",
  isFeatured: true,
  isNewArrival: false,
  isBestSeller: false,
  seoTitle: "Neonatal Breathing Circuit | AVI FirstBreath Store",
  metaDescription: "Buy neonatal breathing circuits for hospital and NICU respiratory workflows."
};

export function AdminProductForm({ product, categories, onSubmitProduct, onCancelEdit }: AdminProductFormProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AdminProductInput>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: product ? productToAdminInput(product) : blankProductValues
  });

  const watchedImages = watch("imageUrls");
  const imageList = useMemo(
    () =>
      watchedImages
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [watchedImages]
  );

  useEffect(() => {
    reset(product ? productToAdminInput(product) : blankProductValues);
  }, [product, reset]);

  async function submit(values: AdminProductInput) {
    setFormError("");
    setSaving(true);
    try {
      await Promise.resolve(onSubmitProduct(values, product?.slug));
      if (!product) {
        reset(blankProductValues);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  function setImages(images: string[]) {
    setValue("imageUrls", images.join("\n"), { shouldDirty: true, shouldValidate: true });
  }

  function addImageUrl() {
    if (!newImageUrl.trim()) return;
    setImages([...imageList, newImageUrl.trim()]);
    setNewImageUrl("");
  }

  function removeImage(index: number) {
    setImages(imageList.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => setImages([...imageList, ...images.filter(Boolean)]));
    event.target.value = "";
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-avi-ink">{product ? "Edit Product" : "Add Product"}</h2>
          <p className="text-sm text-slate-600">Images, variants, flags, SEO fields, and product details save into the MVP product catalogue.</p>
        </div>
        <div className="flex gap-2">
          {product ? (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Cancel Edit
            </Button>
          ) : null}
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>
      {formError ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{formError}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Product Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </AdminField>
        <AdminField label="Slug" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="auto-generated if left blank" />
        </AdminField>
        <AdminField label="SKU" error={errors.sku?.message}>
          <Input {...register("sku")} />
        </AdminField>
        <AdminField label="Price" error={errors.price?.message}>
          <Input type="number" {...register("price")} />
        </AdminField>
        <AdminField label="Sale Price" error={errors.salePrice?.message}>
          <Input type="number" {...register("salePrice")} />
        </AdminField>
        <AdminField label="Category" error={errors.category?.message}>
          <select
            className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-avi-teal focus:outline-none focus:ring-2 focus:ring-avi-teal/20"
            value={watch("categorySlug") || watch("category")}
            onChange={(event) => {
              const category = categories.find((item) => item.slug === event.target.value);
              setValue("categorySlug", category?.slug ?? "", { shouldDirty: true, shouldValidate: true });
              setValue("category", category?.name ?? event.target.value, { shouldDirty: true, shouldValidate: true });
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Category Slug" error={errors.categorySlug?.message}>
          <Input {...register("categorySlug")} />
        </AdminField>
        <AdminField label="Availability" error={errors.availability?.message}>
          <Input {...register("availability")} />
        </AdminField>
        <AdminField label="Tags" error={errors.tags?.message}>
          <Input {...register("tags")} />
        </AdminField>
        <AdminField label="Stock Quantity" error={errors.stockQuantity?.message}>
          <Input type="number" {...register("stockQuantity")} />
        </AdminField>
      </div>

      <AdminField label="Product Pictures" error={errors.imageUrls?.message}>
        <div className="grid gap-3 rounded-lg bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input
              value={newImageUrl}
              onChange={(event) => setNewImageUrl(event.target.value)}
              placeholder="/images/products/product.png or Cloudinary URL"
            />
            <Button type="button" variant="secondary" onClick={addImageUrl}>
              <Plus className="h-4 w-4" />
              Add URL
            </Button>
          </div>
          <label className="grid min-h-24 cursor-pointer place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-avi-teal">
            <ImagePlus className="h-7 w-7 text-avi-teal" aria-hidden="true" />
            <span className="mt-2 text-sm font-semibold text-avi-ink">Upload product pictures</span>
            <span className="text-xs text-slate-500">Uploaded previews are saved into the product image records as data URLs for this MVP.</span>
            <input type="file" accept="image/*" multiple className="sr-only" onChange={handleFileUpload} />
          </label>
          <Textarea className="hidden" {...register("imageUrls")} />
          {imageList.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {imageList.map((image, index) => (
                <div key={`${image}-${index}`} className="rounded-lg border border-border bg-white p-2">
                  <div className="relative aspect-square overflow-hidden rounded-md bg-slate-50">
                    {image.startsWith("data:") || image.startsWith("http") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="h-full w-full object-contain p-2" />
                    ) : (
                      <Image src={image} alt="" fill className="object-contain p-2" />
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="mt-2 w-full" onClick={() => removeImage(index)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </AdminField>

      <div className="grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-2">
        <AdminField label="Features" error={errors.features?.message}>
          <Textarea {...register("features")} placeholder="One feature per line" />
        </AdminField>
        <AdminField label="Variants" error={errors.variants?.message}>
          <Textarea {...register("variants")} placeholder="Size: Neonatal" />
        </AdminField>
        <AdminField label="Similar Products">
          <Input {...register("similarProducts")} placeholder="Product slugs separated by commas" />
        </AdminField>
        <AdminField label="Shipping Details" error={errors.shippingDetails?.message}>
          <Input {...register("shippingDetails")} />
        </AdminField>
      </div>

      <AdminField label="Short Description" error={errors.shortDescription?.message}>
        <Textarea {...register("shortDescription")} />
      </AdminField>
      <AdminField label="Long Description" error={errors.longDescription?.message}>
        <Textarea {...register("longDescription")} />
      </AdminField>

      <div className="grid gap-4 rounded-lg bg-avi-mist p-4 md:grid-cols-2">
        <AdminField label="SEO Title" error={errors.seoTitle?.message}>
          <Input {...register("seoTitle")} />
        </AdminField>
        <AdminField label="Meta Description" error={errors.metaDescription?.message}>
          <Input {...register("metaDescription")} />
        </AdminField>
        <AdminField label="Keywords">
          <Input placeholder="neonatal, CPAP, NICU" />
        </AdminField>
        <AdminField label="Open Graph Image">
          <Input placeholder="/images/products/neonatal-breathing-circuit.png" />
        </AdminField>
        <AdminField label="Canonical URL">
          <Input placeholder="https://firstbreath.avihealthcare.com/products/slug" />
        </AdminField>
        <label className="mt-8 flex items-center gap-2 text-sm font-semibold text-avi-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" defaultChecked />
          Index this product
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm font-semibold text-avi-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" {...register("isFeatured")} />
          Featured product
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm font-semibold text-avi-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" {...register("isNewArrival")} />
          New arrival
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm font-semibold text-avi-ink">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" {...register("isBestSeller")} />
          Best seller
        </label>
      </div>
    </form>
  );
}

function AdminField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
