"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

type Props = {
  href: string;
  exact?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

function ActiveLink({ href, exact, className, onClick, children }: Props) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={className} onClick={onClick} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

/**
 * A link that marks itself with aria-current="page" when active.
 * The pathname is only known at request time on dynamic routes, so the active
 * state streams in behind a Suspense boundary and the plain link prerenders.
 */
export function NavLink(props: Props) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} className={props.className} onClick={props.onClick}>
          {props.children}
        </Link>
      }
    >
      <ActiveLink {...props} />
    </Suspense>
  );
}
