import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <>
      <p className="label text-muted">Join the Lab · Free</p>
      <h1 className="display display-md mt-4">Create your member account.</h1>
      <p className="mt-4 text-ink-soft">
        Set up your founder profile, register for events, share your projects and meet other members.
      </p>
      <div className="mt-10">
        <RegisterForm />
      </div>
      <p className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">
        Already a member?{" "}
        <Link href="/login" className="link font-medium">
          Sign in
        </Link>
      </p>
    </>
  );
}
