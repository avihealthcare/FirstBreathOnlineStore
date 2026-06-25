"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types";

type FilterSidebarProps = {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
  selectedAvailability: string[];
  onAvailabilityChange: (value: string) => void;
  selectedTags: string[];
  onTagChange: (value: string) => void;
  tags: string[];
  onReset: () => void;
};

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedTags,
  onTagChange,
  tags,
  onReset
}: FilterSidebarProps) {
  return (
    <aside className="rounded-xl border border-border bg-white p-4 shadow-sm lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-avi-ink">
          <SlidersHorizontal className="h-4 w-4 text-avi-teal" aria-hidden="true" />
          Filters
        </h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="mt-5 space-y-6">
        <div>
          <Label htmlFor="category-filter">Category</Label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-avi-teal focus:outline-none focus:ring-2 focus:ring-avi-teal/20"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="price-filter">Max price</Label>
            <span className="text-xs font-semibold text-avi-teal">₹{maxPrice}</span>
          </div>
          <input
            id="price-filter"
            type="range"
            min={100}
            max={3000}
            step={50}
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(Number(event.target.value))}
            className="mt-3 w-full accent-avi-teal"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-avi-ink">Availability</p>
          <div className="mt-3 grid gap-2">
            {["In stock", "Limited stock"].map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(value)}
                  onChange={() => onAvailabilityChange(value)}
                  className="h-4 w-4 rounded border-border accent-avi-teal"
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-avi-ink">Tags</p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => onTagChange(tag)}
                  className="h-4 w-4 rounded border-border accent-avi-teal"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
