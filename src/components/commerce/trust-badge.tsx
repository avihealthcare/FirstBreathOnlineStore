import type { LucideIcon } from "lucide-react";

type TrustBadgeProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function TrustBadge({ icon: Icon, title, description }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-avi-mist text-avi-teal">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-bold text-avi-ink">{title}</span>
        <span className="mt-0.5 block text-xs text-slate-600">{description}</span>
      </span>
    </div>
  );
}
