import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <>
      <p className="label text-muted">Member sign in</p>
      <h1 className="display display-md mt-4">Welcome back.</h1>
      <div className="mt-10">
        <Suspense fallback={<LoginForm />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
      <p className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">
        New to the Lab?{" "}
        <Link href="/register" className="link font-medium">
          Create a free account
        </Link>
      </p>
    </>
  );
}

async function Form({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { next, error } = await searchParams;
  return (
    <>
      {error === "link" && (
        <p role="alert" className="mb-6 border-l-2 border-signal-deep py-1 pl-3 text-sm font-medium text-signal-deep">
          That link is invalid or has expired. Please sign in, or request a new link.
        </p>
      )}
      <LoginForm next={typeof next === "string" ? next : undefined} />
    </>
  );
}
