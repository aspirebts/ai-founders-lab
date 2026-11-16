import Link from "next/link";
import { getUser } from "@/lib/auth";

const cls = "link whitespace-nowrap";

export function AccountLinkFallback() {
  return (
    <Link href="/login" className={cls}>
      Sign in
    </Link>
  );
}

/** Reads the session, so it must be rendered inside a Suspense boundary. */
export async function AccountLink() {
  const user = await getUser();
  if (!user) return <AccountLinkFallback />;
  return (
    <Link href="/portal" className={cls}>
      Member portal
    </Link>
  );
}
