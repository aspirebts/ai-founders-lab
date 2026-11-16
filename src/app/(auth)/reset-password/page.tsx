import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <>
      <p className="label text-muted">Password reset</p>
      <h1 className="display display-md mt-4">Set a new password.</h1>
      <div className="mt-10">
        <ResetPasswordForm />
      </div>
    </>
  );
}
