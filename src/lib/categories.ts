import {
  Briefcase,
  Newspaper,
  Wallet,
  ShoppingBag,
  Bell,
  Users,
  Inbox,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey =
  | "all"
  | "job"
  | "newsletter"
  | "finance"
  | "shopping"
  | "notification"
  | "social"
  | "other";

export type CategoryMeta = {
  key: CategoryKey;
  label: string;
  plural: string;
  icon: LucideIcon;
  /** Tailwind classes for the badge */
  badgeClass: string;
  /** Matches a raw category string (case-insensitive) from email_categories.category */
  matches: (raw: string | null | undefined) => boolean;
};

const norm = (s: string | null | undefined) => (s ?? "").toLowerCase().trim();

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "all",
    label: "All Emails",
    plural: "All Emails",
    icon: Inbox,
    badgeClass: "bg-muted text-foreground border border-border",
    matches: () => true,
  },
  {
    key: "job",
    label: "Job",
    plural: "Jobs",
    icon: Briefcase,
    badgeClass: "bg-cat-job/15 text-cat-job border border-cat-job/30",
    matches: (r) => /job|career|hir/.test(norm(r)),
  },
  {
    key: "newsletter",
    label: "Newsletter",
    plural: "Newsletters",
    icon: Newspaper,
    badgeClass: "bg-cat-newsletter/15 text-cat-newsletter border border-cat-newsletter/30",
    matches: (r) => /newsletter|digest/.test(norm(r)),
  },
  {
    key: "finance",
    label: "Finance",
    plural: "Finance",
    icon: Wallet,
    badgeClass: "bg-cat-finance/15 text-cat-finance border border-cat-finance/30",
    matches: (r) => /finance|bank|invoice|payment|billing/.test(norm(r)),
  },
  {
    key: "shopping",
    label: "Shopping",
    plural: "Shopping",
    icon: ShoppingBag,
    badgeClass: "bg-cat-shopping/15 text-cat-shopping border border-cat-shopping/30",
    matches: (r) => /shop|order|receipt|purchase/.test(norm(r)),
  },
  {
    key: "notification",
    label: "Notification",
    plural: "Notifications",
    icon: Bell,
    badgeClass: "bg-cat-notification/15 text-cat-notification border border-cat-notification/30",
    matches: (r) => /notif|alert/.test(norm(r)),
  },
  {
    key: "social",
    label: "Social",
    plural: "Social",
    icon: Users,
    badgeClass: "bg-cat-social/15 text-cat-social border border-cat-social/30",
    matches: (r) => /social|friend|follow/.test(norm(r)),
  },
  {
    key: "other",
    label: "Other",
    plural: "Other",
    icon: Mail,
    badgeClass: "bg-cat-other/15 text-cat-other border border-cat-other/30",
    matches: (r) => {
      const n = norm(r);
      if (!n) return true;
      return !CATEGORIES.slice(1, 7).some((c) => c.matches(r));
    },
  },
];

export function categoryFromRaw(raw: string | null | undefined): CategoryMeta {
  if (!raw) return CATEGORIES.find((c) => c.key === "other")!;
  for (const c of CATEGORIES.slice(1, 7)) {
    if (c.matches(raw)) return c;
  }
  return CATEGORIES.find((c) => c.key === "other")!;
}

export function categoryByKey(key: string | undefined): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.key === key);
}
