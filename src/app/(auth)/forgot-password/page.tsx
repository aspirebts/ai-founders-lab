import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <p className="label text-muted">Password reset</p>
      <h1 className="display display-md mt-4">Forgot your password?</h1>
      <p className="mt-4 text-ink-soft">Enter your email address and we will send you a link to set a new one.</p>
      <div className="mt-10">
        <ForgotPasswordForm />
      </div>
      <p className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">
        <Link href="/login" className="link font-medium">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
