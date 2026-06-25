"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className="grid gap-3 lg:grid-cols-[72px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            aria-label={`View ${name} image ${index + 1}`}
            onClick={() => setSelected(image)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition",
              selected === image ? "border-avi-teal ring-2 ring-avi-teal/20" : "border-border hover:border-avi-teal"
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
      <div className="relative order-1 aspect-square overflow-hidden rounded-xl border border-border bg-white shadow-soft lg:order-2">
        {selected.startsWith("http") || selected.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selected} alt={name} className="h-full w-full object-contain p-8" />
        ) : (
          <Image src={selected} alt={name} fill className="object-contain p-8" priority />
        )}
      </div>
    </div>
  );
}
