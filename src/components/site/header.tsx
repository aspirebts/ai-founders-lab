"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { mainNav } from "@/lib/content/site";

export function Header({ account }: { account: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.92rem]">
            {mainNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="relative py-2 text-ink-soft transition-colors after:absolute after:inset-x-0 after:-bottom-[1.05rem] after:h-px after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100 aria-[current=page]:text-ink aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden text-[0.92rem] sm:block">{account}</div>
          <ButtonLink href="/apply" size="sm" className="hidden sm:inline-flex">
            Apply
          </ButtonLink>
          <button
            type="button"
            className="label -mr-2 flex h-10 items-center gap-2 px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0.5"}`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" onClick={close} className="wrap flex min-h-full flex-col justify-between py-8">
          <ul>
            {mainNav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link href={item.href} className="flex items-baseline gap-4 py-4">
                  <span className="label text-muted">0{i + 1}</span>
                  <span className="display text-4xl">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3">
            <ButtonLink href="/apply" size="lg">
              Apply to the founder cohort
            </ButtonLink>
            <ButtonLink href="/waitlist" size="lg" variant="outline">
              Join the waitlist
            </ButtonLink>
            <div className="pt-3 text-center">{account}</div>
          </div>
        </nav>
      </div>
    </header>
  );
}
