import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Shell } from "@/components/portal/shell";
import { Identity, IdentityFallback, PageLoading } from "@/components/portal/parts";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · AI Founders Lab" },
  robots: { index: false },
};

const nav = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Shell
      area="Admin"
      nav={nav}
      identity={
        <Suspense fallback={<IdentityFallback />}>
          <Identity />
        </Suspense>
      }
      extra={
        <Link href="/portal" className="label link">
          ← Member portal
        </Link>
      }
    >
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
    </Shell>
  );
}
