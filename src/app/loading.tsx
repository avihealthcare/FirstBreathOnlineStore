export default function Loading() {
  return (
    <div className="container flex min-h-96 items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-soft">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 space-y-3">
          <div className="h-4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
          <div className="h-11 w-40 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
