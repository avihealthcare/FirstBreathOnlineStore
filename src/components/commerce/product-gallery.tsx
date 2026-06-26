"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(images[0]);
  const [zoomOpen, setZoomOpen] = useState(false);
  const safeSelected = selected ?? images[0] ?? "/images/products/neonatal-breathing-circuit.png";

  function ProductImage({ className }: { className: string }) {
    return safeSelected.startsWith("http") || safeSelected.startsWith("data:") ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={safeSelected} alt={name} className={className} />
    ) : (
      <Image src={safeSelected} alt={name} fill className={className} priority />
    );
  }

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[72px_1fr]">
        <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              aria-label={`View ${name} image ${index + 1}`}
              onClick={() => setSelected(image)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition",
                safeSelected === image ? "border-avi-teal ring-2 ring-avi-teal/20" : "border-border hover:border-avi-teal"
              )}
            >
              {image.startsWith("http") || image.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="h-full w-full object-contain p-2" />
              ) : (
                <Image src={image} alt="" fill className="object-contain p-2" />
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="group relative order-1 aspect-square overflow-hidden rounded-xl border border-border bg-white shadow-soft lg:order-2"
          aria-label={`Zoom ${name} photograph`}
        >
          <ProductImage className="object-contain p-8 transition duration-300 group-hover:scale-110" />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg border border-border bg-white/95 px-3 py-2 text-xs font-bold text-avi-ink shadow-sm">
            <Maximize2 className="h-4 w-4 text-avi-teal" />
            Zoom
          </span>
        </button>
      </div>

      {zoomOpen ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-avi-ink/80 p-4" role="dialog" aria-modal="true">
          <div className="relative h-[86vh] w-full max-w-5xl rounded-xl bg-white p-4 shadow-2xl">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Close zoom view"
              className="absolute right-4 top-4 z-10"
              onClick={() => setZoomOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-slate-50">
              <ProductImage className="object-contain p-6" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
