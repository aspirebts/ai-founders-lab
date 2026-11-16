"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useTransition, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Arrow, buttonClass } from "@/components/ui/button";
import { idleState, type FormState } from "@/lib/types";

/**
 * Wraps useActionState so that a failed submission keeps what the person typed.
 * (React resets uncontrolled fields after a plain form action.) Without
 * JavaScript the form still posts to the same Server Action.
 */
export function useForm(fn: (prev: FormState, formData: FormData) => Promise<FormState>) {
  const [state, action, actionPending] = useActionState(fn, idleState);
  const [transitionPending, startTransition] = useTransition();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };
  return { state, pending: actionPending || transitionPending, form: { action, onSubmit } };
}

const control =
  "block w-full border border-ink/30 bg-white/50 px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:bg-white focus:outline-none focus-visible:outline-2 focus-visible:outline-signal aria-[invalid=true]:border-signal-deep";

type FieldShell = {
  label: string;
  name: string;
  /** Prefix for element ids when two forms on one page share field names. */
  idPrefix?: string;
  hint?: string;
  optional?: boolean;
  errors?: string[];
};

const fieldId = (name: string, idPrefix?: string) => (idPrefix ? `${idPrefix}-${name}` : name);

function Shell({
  label,
  name: fieldName,
  idPrefix,
  hint,
  optional,
  errors,
  children,
}: FieldShell & { children: ReactNode }) {
  const name = fieldId(fieldName, idPrefix);
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="label text-muted">Optional</span>}
      </label>
      {children}
      {hint && !errors?.length && (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {errors?.length ? (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm font-medium text-signal-deep">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}

function aria(name: string, hint?: string, errors?: string[], idPrefix?: string) {
  const id = fieldId(name, idPrefix);
  return {
    id,
    name,
    "aria-invalid": errors?.length ? true : undefined,
    "aria-describedby": errors?.length ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

export function TextField({
  label,
  name,
  idPrefix,
  hint,
  optional,
  errors,
  ...props
}: FieldShell & Omit<ComponentProps<"input">, "name" | "id">) {
  return (
    <Shell label={label} name={name} idPrefix={idPrefix} hint={hint} optional={optional} errors={errors}>
      <input className={control} required={!optional} {...aria(name, hint, errors, idPrefix)} {...props} />
    </Shell>
  );
}

export function TextArea({
  label,
  name,
  idPrefix,
  hint,
  optional,
  errors,
  rows = 5,
  ...props
}: FieldShell & Omit<ComponentProps<"textarea">, "name" | "id">) {
  return (
    <Shell label={label} name={name} idPrefix={idPrefix} hint={hint} optional={optional} errors={errors}>
      <textarea
        className={`${control} resize-y leading-relaxed`}
        rows={rows}
        required={!optional}
        {...aria(name, hint, errors, idPrefix)}
        {...props}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  name,
  idPrefix,
  hint,
  optional,
  errors,
  options,
  placeholder = "Select…",
  ...props
}: FieldShell & { options: Record<string, string>; placeholder?: string | null } & Omit<
    ComponentProps<"select">,
    "name" | "id"
  >) {
  return (
    <Shell label={label} name={name} idPrefix={idPrefix} hint={hint} optional={optional} errors={errors}>
      <select
        className={`${control} select-chevron pr-10`}
        required={!optional}
        {...aria(name, hint, errors, idPrefix)}
        {...props}
        defaultValue={props.defaultValue ?? (placeholder === null ? undefined : "")}
      >
        {placeholder !== null && (
          <option value="" disabled={!optional}>
            {placeholder}
          </option>
        )}
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </Shell>
  );
}

export function Checkbox({
  name,
  children,
  errors,
  idPrefix,
  ...props
}: { name: string; children: ReactNode; errors?: string[]; idPrefix?: string } & Omit<
  ComponentProps<"input">,
  "name" | "id" | "type"
>) {
  const id = fieldId(name, idPrefix);
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-snug">
        <input
          type="checkbox"
          id={id}
          name={name}
          className="check mt-0.5"
          aria-invalid={errors?.length ? true : undefined}
          {...props}
        />
        <span>{children}</span>
      </label>
      {errors?.length ? (
        <p role="alert" className="mt-1.5 pl-8 text-sm font-medium text-signal-deep">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}

/** Invisible to people; attractive to bots. Checked in the Server Action. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Sending…",
  variant = "primary",
  size = "md",
  className = "",
  pending: pendingProp,
}: {
  children: ReactNode;
  pending?: boolean;
  pendingLabel?: string;
  variant?: "primary" | "signal" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, size, className)}>
      {pending ? pendingLabel : children}
      {!pending && <Arrow />}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.status === "idle" || !state.message) return null;
  const ok = state.status === "success";
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`border-l-2 py-1 pl-3 text-sm font-medium ${
        ok ? "border-ok text-ok" : "border-signal-deep text-signal-deep"
      }`}
    >
      {state.message}
    </p>
  );
}

/** Small inline button for row actions that call a Server Action directly. */
export function ActionButton({
  children,
  confirm,
  danger,
}: {
  children: ReactNode;
  confirm?: string;
  danger?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`label underline decoration-1 underline-offset-4 disabled:opacity-40 ${
        danger ? "text-signal-deep hover:text-ink" : "hover:text-signal-deep"
      }`}
    >
      {pending ? "Working…" : children}
    </button>
  );
}
