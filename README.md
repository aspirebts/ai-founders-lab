# AI Founders Lab

Website and member platform for AI Founders Lab, an online school, startup incubator and founder community for people building profitable one-person businesses with AI.

## Stack

- **Next.js 16** (App Router, Cache Components, Server Actions) with TypeScript
- **Tailwind CSS 4** with a custom design system (`src/app/globals.css`)
- **Supabase**: Postgres, Auth (email + password) and Storage (profile photos)
- **Zod** for validation; `react-markdown` (no raw HTML) for event and resource content
- Fonts are self-hosted: Fraunces (display), Geist Sans (text), Geist Mono (labels)

No other third-party services. No payment provider is integrated: consultations are requested through a form, and the fee is agreed by email.

## Run locally

Requires Node 20+ and Docker (for the local Supabase stack).

```bash
npm install
npx supabase start          # starts Postgres, Auth, Storage locally
npx supabase db reset       # applies migrations and loads sample content
cp .env.example .env.local  # then fill in values from `npx supabase status`
npm run dev
```

Open http://localhost:3000. Confirmation and reset emails are captured locally by Mailpit (URL shown by `npx supabase status`).

### Make yourself an admin

Register an account through the site, then run:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

(Locally: `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres`. Hosted: the Supabase SQL editor.) After that, further admins can be promoted from **Admin > Members**.

## Deploy

1. Create a Supabase project. Link and push the schema: `npx supabase link --project-ref <ref>` then `npx supabase db push`. Optionally run `supabase/seed.sql` in the SQL editor for sample content.
2. In Supabase **Auth > URL configuration**, set the Site URL to your domain and add `https://<domain>/auth/confirm` as a redirect URL. Turn on email confirmation and configure an SMTP provider for production email.
3. Deploy the Next.js app (Vercel or any Node host) with the environment variables from `.env.example`.

## Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key. Safe to expose: all access is governed by row level security |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used in auth email links |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional address shown on the Contact page |

The service-role key is **not** used anywhere and should never be added to this app.

## What is where

```
src/app/(site)/        Public pages: home, about, programs, how-it-works, community,
                       events, resources, contact, apply, waitlist, brand, privacy
src/app/(auth)/        Login, register, forgot and reset password
src/app/auth/confirm   Landing route for links in auth emails
src/app/portal/        Member portal: dashboard, profile, programmes, events,
                       resources, projects, community
src/app/admin/         Admin: overview, applications, waitlist, members, events,
                       resources, subscribers, enquiries, CSV export
src/lib/actions/       Server Actions (public forms, auth, member, admin)
src/lib/content/       Programme definitions and site copy kept in code
src/lib/data/          Cached reads of public content
src/lib/validation.ts  All form schemas
src/proxy.ts           Session refresh and route protection
supabase/migrations/   Database schema, RLS policies, functions, storage bucket
supabase/seed.sql      Sample events and resources (flagged is_sample)
```

## Database and security

Tables: `profiles`, `applications`, `waitlist_entries`, `newsletter_subscribers`, `consultation_requests`, `contact_messages`, `events`, `event_registrations`, `resources`, `enrollments`, `projects`. Profile photos live in the `avatars` storage bucket under a folder per user.

- Row level security is on for every table. Visitors may only **insert** into intake tables, and cannot set review fields (e.g. submit a pre-accepted application).
- Members read and edit only their own rows. Column privileges stop members changing their own `role`.
- Admin status is `profiles.role = 'admin'`, checked by `private.is_admin()` in policies, again in every admin page and Server Action, and in the proxy.
- The member directory and project showcase are served by `security definer` functions that return only public-safe fields, only to signed-in members, and only for people who opted in. Email, experience and business idea are never exposed.
- Event registration runs through `register_for_event()`, which enforces capacity and closing time atomically.
- All forms validate on the server with Zod, include a honeypot field, and avoid revealing whether an email is already registered. CSV exports neutralise spreadsheet formulas.

## Content management

- **Events and resources**: Admin area. Markdown supported. Use the "sample" flag for placeholder content; it is labelled on the site.
- **Programmes**: `src/lib/content/programs.ts`. To add a programme, add an entry; it appears on the Programs pages, in application and waitlist forms, and in admin enrolment.
- **Showcase**: The homepage showcase uses clearly labelled sample businesses from `src/lib/content/site.ts`. Replace with real founder stories when available.

## Product assumptions

- Programmes are free; the cohort start date is "to be announced", so applications are reviewed and answered once dates are set.
- Accepting an application auto-enrols the applicant if they applied while signed in; otherwise enrol them from Admin > Members after they register.
- Email notifications (to applicants, registrants, subscribers) are not sent by the app. Admins export lists as CSV for their email tool. Adding a transactional email provider is a natural next step.
- Event times are entered in UTC and shown to visitors in their local time zone.
- The newsletter is a subscriber list only; sending is done in an external tool.

## Quality checks

```bash
npx tsc --noEmit
npx eslint src
npm run build
```

An end-to-end pass covered every public page, all forms (valid, invalid and duplicate submissions), registration, login and logout, password reset request, profile and photo upload, projects, journey stage, event registration, capacity and cancellation, members-only content, admin access control, application review and enrolment, event and resource publishing, CSV exports, mobile layouts (no horizontal overflow at phone width) and direct database permission probes.

## Brand

The proposed identity is documented live at `/brand`: the "Apex and Dot" mark, ink/paper/signal palette, type system, components and visual principles.
