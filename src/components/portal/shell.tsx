import type { ReactNode } from "react";
import { NavLink } from "@/components/ui/nav-link";
import { Logo } from "@/components/brand/logo";
import { logout } from "@/lib/actions/auth";

export type ShellNavItem = { href: string; label: string; exact?: boolean };

/** Shared chrome for the member portal and the admin area. */
export function Shell({
  area,
  nav,
  identity,
  extra,
  children,
}: {
  area: string;
  nav: ShellNavItem[];
  identity: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="on-ink lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-6"
          style={{ "--mark-bg": "#f3efe6", "--mark-fg": "#11110f" } as React.CSSProperties}
        >
          <Logo />
          <p className="label text-signal lg:mt-6">{area}</p>
        </div>

        <nav aria-label={area} className="border-t border-line-dark lg:flex-1 lg:overflow-y-auto lg:py-4">
          <ul className="flex gap-1 overflow-x-auto px-3 py-2 lg:block lg:space-y-0.5 lg:px-3 lg:py-0">
            {nav.map((item) => (
              <li key={item.href} className="shrink-0">
                <NavLink
                  href={item.href}
                  exact={item.exact}
                  className="flex items-center gap-3 px-3 py-2 text-[0.92rem] whitespace-nowrap text-paper/70 transition-colors hover:text-paper aria-[current=page]:bg-paper aria-[current=page]:font-medium aria-[current=page]:text-ink"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {extra && <div className="hidden border-t border-line-dark px-6 py-4 lg:mt-4 lg:block">{extra}</div>}
        </nav>

        <div className="hidden border-t border-line-dark px-6 py-5 lg:block">
          {identity}
          <form action={logout} className="mt-4">
            <button type="submit" className="label link text-muted-dark hover:text-paper">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 text-sm lg:hidden">
          <div className="min-w-0">{identity}</div>
          <div className="flex shrink-0 items-center gap-4">
            {extra}
            <form action={logout}>
              <button type="submit" className="label link">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <main id="main" className="flex-1 px-5 py-8 md:px-10 md:py-12">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
