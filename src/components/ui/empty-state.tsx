import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <SearchX className="mb-3 h-10 w-10 text-avi-teal" aria-hidden="true" />
      <h3 className="text-lg font-bold text-avi-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>
    </div>
  );
}
