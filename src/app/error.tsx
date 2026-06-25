"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container flex min-h-96 items-center justify-center py-16">
      <div className="max-w-lg rounded-xl border border-border bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-avi-teal">Something needs attention</p>
        <h1 className="mt-3 text-2xl font-bold text-avi-ink">We could not load this section.</h1>
        <p className="mt-3 text-sm text-slate-600">
          Please retry. If this persists during launch, check environment variables and data source availability.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
