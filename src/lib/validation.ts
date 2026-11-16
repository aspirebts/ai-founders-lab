import { z } from "zod";
import { programSlugs } from "@/lib/content/programs";
import type { FormState } from "@/lib/types";

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const optionalText = (max: number) =>
  text(max)
    .optional()
    .transform((v) => (v ? v : null));

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email("Enter a valid email address."));

const name = text(120).min(2, "Enter your name.");

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((v) => {
    if (!v) return null;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  .refine((v) => v === null || z.url().safeParse(v).success, "Enter a valid link.");

const program = z.enum(programSlugs, "Choose a programme.");
const stage = z.enum(["discover", "validate", "build", "launch", "grow"]);
// An unchecked checkbox is simply absent from the submitted form.
const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on" || v === "true");

const list = (maxItems: number) =>
  z
    .string()
    .max(600)
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, maxItems)
        .map((s) => s.slice(0, 40)),
    );

export const waitlistSchema = z.object({
  full_name: name,
  email,
  program_slug: program,
  source: optionalText(80),
});

export const newsletterSchema = z.object({
  email,
  source: optionalText(80),
});

export const applicationSchema = z.object({
  program_slug: program,
  full_name: name,
  email,
  country: text(80).min(2, "Enter your country."),
  linkedin_url: optionalUrl,
  occupation: text(160).min(2, "Tell us what you do today."),
  background: z.enum(
    ["aspiring", "non_technical", "corporate", "engineer", "beginner", "other"],
    "Choose the option that fits best.",
  ),
  technical_level: z.enum(["none", "some", "comfortable", "professional"], "Choose one."),
  idea_stage: z.enum(["no_idea", "idea", "validating", "building", "launched"], "Choose one."),
  idea_summary: optionalText(3000),
  experience: optionalText(3000),
  motivation: text(3000).min(20, "Tell us a little more (at least 20 characters)."),
  weekly_hours: z.enum(["under_5", "5_10", "10_20", "over_20"], "Choose one."),
  referral_source: optionalText(200),
  consent: checkbox.refine((v) => v, "Please confirm to continue."),
});

export const consultationSchema = z.object({
  full_name: name,
  email,
  topic: z.enum(
    ["idea_validation", "product_build", "go_to_market", "ai_strategy", "other"],
    "Choose a topic.",
  ),
  details: text(3000).min(20, "Give us a little more detail (at least 20 characters)."),
  availability: optionalText(300),
});

export const contactSchema = z.object({
  full_name: name,
  email,
  subject: text(160).min(2, "Enter a subject."),
  message: text(3000).min(10, "Write a short message."),
});

export const eventRegistrationSchema = z.object({
  event_id: z.uuid(),
  full_name: name,
  email,
});

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use 72 characters or fewer.");

export const registerSchema = z.object({ full_name: name, email, password });
export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password.") });
export const forgotSchema = z.object({ email });
export const resetSchema = z.object({ password });

export const profileSchema = z.object({
  full_name: name,
  headline: optionalText(160),
  bio: optionalText(2000),
  location: optionalText(120),
  website_url: optionalUrl,
  linkedin_url: optionalUrl,
  interests: list(12),
  skills: list(12),
  experience: optionalText(3000),
  business_idea: optionalText(3000),
  is_listed: checkbox,
});

export const projectSchema = z.object({
  name: text(120).min(2, "Give the project a name."),
  one_liner: text(200).min(5, "Describe it in one line."),
  description: optionalText(3000),
  url: optionalUrl,
  stage,
  is_public: checkbox,
});

export const stageSchema = z.object({ journey_stage: stage });

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .max(120)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

const dateTime = z
  .string()
  .min(1, "Choose a date and time.")
  .transform((v) => new Date(/Z|[+-]\d\d:\d\d$/.test(v) ? v : `${v}:00Z`))
  .refine((d) => !Number.isNaN(d.getTime()), "Enter a valid date and time.");

export const eventSchema = z
  .object({
    title: text(160).min(3, "Enter a title."),
    slug,
    kind: z.enum(["workshop", "masterclass", "founder_session", "community"]),
    summary: text(300).min(10, "Write a one or two sentence summary."),
    description: text(8000),
    starts_at: dateTime,
    ends_at: dateTime,
    location: text(160).min(2, "Enter a location, or Online."),
    capacity: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? Number(v) : null))
      .refine((v) => v === null || (Number.isInteger(v) && v > 0), "Enter a whole number, or leave empty."),
    is_published: checkbox,
    is_sample: checkbox,
  })
  .refine((v) => v.ends_at > v.starts_at, {
    path: ["ends_at"],
    message: "The end must be after the start.",
  });

export const resourceSchema = z.object({
  title: text(160).min(3, "Enter a title."),
  slug,
  kind: z.enum(["article", "guide", "tool", "material"]),
  summary: text(300).min(10, "Write a one or two sentence summary."),
  body: text(60000),
  external_url: optionalUrl,
  members_only: checkbox,
  is_published: checkbox,
  is_sample: checkbox,
});

/** Parse FormData against a schema, returning either data or a FormState error. */
export function parseForm<T extends z.ZodType>(
  schema: T,
  formData: FormData,
): { data: z.output<T>; error?: undefined } | { data?: undefined; error: FormState } {
  const raw: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") raw[key] = value;
  });
  const result = schema.safeParse(raw);
  if (result.success) return { data: result.data };
  return {
    error: {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
    },
  };
}
