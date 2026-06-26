"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/commerce/product-card";
import { SearchBar } from "@/components/commerce/search-bar";
import { FilterSidebar } from "@/components/commerce/filter-sidebar";
import type { Category, Product } from "@/types";

type ProductCatalogProps = {
  products: Product[];
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
};

export function ProductCatalog({ products, categories, initialSearch = "", initialCategory = "all" }: ProductCatalogProps) {
  const catalogueProducts = products;
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [availability, setAvailability] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState("popularity");

  const tags = useMemo(() => Array.from(new Set(catalogueProducts.flatMap((product) => product.tags))).sort(), [catalogueProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = catalogueProducts.filter((product) => {
      const price = product.salePrice ?? product.price;
      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.shortDescription, product.category, product.sku, ...product.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesCategory = selectedCategory === "all" || product.categorySlug === selectedCategory;
      const matchesPrice = price <= maxPrice;
      const matchesAvailability = availability.length === 0 || availability.includes(product.availability);
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => product.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability && matchesTags;
    });

    return result.sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sort === "price-asc") return priceA - priceB;
      if (sort === "price-desc") return priceB - priceA;
      if (sort === "new") return Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival));
      return b.popularity - a.popularity;
    });
  }, [availability, catalogueProducts, maxPrice, search, selectedCategory, selectedTags, sort]);

  function toggleValue(value: string, values: string[], setter: (values: string[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  function resetFilters() {
    setSearch("");
    setSelectedCategory("all");
    setMaxPrice(3000);
    setAvailability([]);
    setSelectedTags([]);
    setSort("popularity");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <FilterSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        selectedAvailability={availability}
        onAvailabilityChange={(value) => toggleValue(value, availability, setAvailability)}
        selectedTags={selectedTags}
        onTagChange={(value) => toggleValue(value, selectedTags, setSelectedTags)}
        tags={tags}
        onReset={resetFilters}
      />

      <section aria-labelledby="products-heading">
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <h1 id="products-heading" className="text-2xl font-black text-avi-ink">
              All Products
            </h1>
            <p className="mt-1 text-sm text-slate-600">{filteredProducts.length} products found</p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(220px,320px)_180px]">
            <SearchBar value={search} onChange={setSearch} />
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 rounded-lg border border-input bg-white px-3 text-sm focus:border-avi-teal focus:outline-none focus:ring-2 focus:ring-avi-teal/20"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="new">New arrivals</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            description="Try changing search, category, price, availability, or tag filters."
          />
        )}
      </section>
    </div>
  );
}
