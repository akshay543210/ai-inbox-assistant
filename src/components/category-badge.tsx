import { cn } from "@/lib/utils";
import type { CategoryMeta } from "@/lib/categories";

export function CategoryBadge({ category, className }: { category: CategoryMeta; className?: string }) {
  const Icon = category.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        category.badgeClass,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {category.label}
    </span>
  );
}
