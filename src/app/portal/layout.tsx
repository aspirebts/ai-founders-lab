import type { Metadata } from "next";
import { Suspense } from "react";
import { Shell } from "@/components/portal/shell";
import { AdminLink, Identity, IdentityFallback, PageLoading } from "@/components/portal/parts";

export const metadata: Metadata = {
  title: { default: "Member portal", template: "%s · Member portal · AI Founders Lab" },
  robots: { index: false },
};

const nav = [
  { href: "/portal", label: "Dashboard", exact: true },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/programs", label: "Programmes" },
  { href: "/portal/events", label: "Events" },
  { href: "/portal/resources", label: "Resources" },
  { href: "/portal/projects", label: "Projects" },
  { href: "/portal/community", label: "Community" },
];

export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return (
    <Shell
      area="Member portal"
      nav={nav}
      identity={
        <Suspense fallback={<IdentityFallback />}>
          <Identity />
        </Suspense>
      }
      extra={
        <Suspense fallback={null}>
          <AdminLink />
        </Suspense>
      }
    >
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
    </Shell>
  );
}
