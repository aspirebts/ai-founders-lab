"use client";

import { subscribeNewsletter } from "@/lib/actions/public";
import { Honeypot, useForm } from "@/components/ui/form";

export function NewsletterForm({ source, inverted = false }: { source: string; inverted?: boolean }) {
  const { state, form, pending } = useForm(subscribeNewsletter);
  const id = `newsletter-email-${source}`;

  if (state.status === "success") {
    return (
      <p role="status" className="flex items-center gap-3 border-l-2 border-signal py-2 pl-4 font-medium">
        {state.message}
      </p>
    );
  }

  return (
    <form {...form} className="relative">
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className={`flex border-b ${inverted ? "border-paper/50 focus-within:border-paper" : "border-ink/50 focus-within:border-ink"} transition-colors`}>
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby={state.status === "error" ? `${id}-error` : undefined}
          className={`min-w-0 flex-1 bg-transparent py-3 text-base focus:outline-none ${inverted ? "placeholder:text-muted-dark" : "placeholder:text-muted"}`}
        />
        <button
          type="submit"
          disabled={pending}
          className="label shrink-0 pl-4 transition-colors hover:text-signal disabled:opacity-50"
        >
          {pending ? "Subscribing…" : "Subscribe →"}
        </button>
      </div>
      {state.status === "error" && (
        <p id={`${id}-error`} role="alert" className={`mt-2 text-sm font-medium ${inverted ? "text-signal" : "text-signal-deep"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
