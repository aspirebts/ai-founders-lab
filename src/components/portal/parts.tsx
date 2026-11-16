import Link from "next/link";
import type { ReactNode } from "react";
import { getProfile, getUser } from "@/lib/auth";
import { initials } from "@/lib/format";

export function Avatar({ name, url, size = 36 }: { name: string; url?: string | null; size?: number }) {
  return url ? (
    // Avatars are user uploads served from Supabase Storage; plain <img> avoids
    // configuring remote image hosts per environment.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center bg-signal font-medium text-ink"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  );
}

/** Signed-in member chip. Reads the session: render inside Suspense. */
export async function Identity() {
  const [user, profile] = await Promise.all([getUser(), getProfile()]);
  if (!user) return null;
  const name = profile?.full_name || "Member";
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name} url={profile?.avatar_url} />
      <div className="min-w-0 leading-tight">
        <p className="truncate font-medium">{name}</p>
        <p className="truncate text-xs opacity-60">{user.email}</p>
      </div>
    </div>
  );
}

export function IdentityFallback() {
  return <div className="h-9 w-40 animate-pulse bg-current/10" />;
}

export async function AdminLink() {
  const profile = await getProfile();
  if (profile?.role !== "admin") return null;
  return (
    <Link href="/admin" className="label link">
      Admin area →
    </Link>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-6">
      <div>
        <p className="label text-muted">{eyebrow}</p>
        <h1 className="display display-md mt-3">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-ink-soft">{children}</div>}
      </div>
      {action}
    </header>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-line bg-white/40 ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 className="label text-muted">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PageLoading() {
  return (
    <div aria-busy="true" className="space-y-4">
      <p className="label text-muted">Loading…</p>
      <div className="h-10 w-2/3 animate-pulse bg-ink/10" />
      <div className="h-40 animate-pulse bg-ink/5" />
    </div>
  );
}
