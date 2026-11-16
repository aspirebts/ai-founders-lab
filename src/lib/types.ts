export type JourneyStage = "discover" | "validate" | "build" | "launch" | "grow";

export type Profile = {
  id: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  interests: string[];
  skills: string[];
  experience: string | null;
  business_idea: string | null;
  journey_stage: JourneyStage;
  is_listed: boolean;
  role: "member" | "admin";
  created_at: string;
  updated_at: string;
};

export type EventKind = "workshop" | "masterclass" | "founder_session" | "community";

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  kind: EventKind;
  summary: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location: string;
  capacity: number | null;
  is_published: boolean;
  is_sample: boolean;
  created_at: string;
};

export type ResourceKind = "article" | "guide" | "tool" | "material";

export type ResourceRow = {
  id: string;
  slug: string;
  title: string;
  kind: ResourceKind;
  summary: string;
  body: string;
  external_url: string | null;
  members_only: boolean;
  is_published: boolean;
  is_sample: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationStatus = "submitted" | "in_review" | "shortlisted" | "accepted" | "declined";

export type ApplicationRow = {
  id: string;
  user_id: string | null;
  program_slug: string;
  full_name: string;
  email: string;
  country: string;
  linkedin_url: string | null;
  occupation: string;
  background: string;
  technical_level: string;
  idea_stage: string;
  idea_summary: string | null;
  experience: string | null;
  motivation: string;
  weekly_hours: string;
  referral_source: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type ProjectRow = {
  id: string;
  owner_id: string;
  name: string;
  one_liner: string;
  description: string | null;
  url: string | null;
  stage: JourneyStage;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

/** Shape returned by every form Server Action, consumed with useActionState. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const idleState: FormState = { status: "idle" };
