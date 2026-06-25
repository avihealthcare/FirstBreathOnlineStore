import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <Quote className="h-8 w-8 text-avi-teal" aria-hidden="true" />
      <p className="mt-4 text-sm leading-6 text-slate-700">{testimonial.quote}</p>
      <div className="mt-5 flex items-center gap-1 text-amber-500" aria-label={`${testimonial.rating} star rating`}>
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
        ))}
      </div>
      <div className="mt-4">
        <p className="font-bold text-avi-ink">{testimonial.authorName}</p>
        <p className="text-sm text-slate-600">
          {testimonial.authorTitle}
          {testimonial.hospitalName ? `, ${testimonial.hospitalName}` : ""}
        </p>
      </div>
    </article>
  );
}
