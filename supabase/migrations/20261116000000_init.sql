-- AI Founders Lab: initial schema
-- Security model
--   * Every table has row level security enabled.
--   * Visitors (anon) may only INSERT into the public intake tables.
--   * Members read and write their own rows.
--   * Admins (profiles.role = 'admin') manage everything.
--   * The app never needs the service role key.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  headline text check (char_length(headline) <= 160),
  bio text check (char_length(bio) <= 2000),
  location text check (char_length(location) <= 120),
  avatar_url text check (char_length(avatar_url) <= 500),
  website_url text check (char_length(website_url) <= 300),
  linkedin_url text check (char_length(linkedin_url) <= 300),
  interests text[] not null default '{}',
  skills text[] not null default '{}',
  experience text check (char_length(experience) <= 3000),
  business_idea text check (char_length(business_idea) <= 3000),
  journey_stage text not null default 'discover'
    check (journey_stage in ('discover', 'validate', 'build', 'launch', 'grow')),
  is_listed boolean not null default false,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per registered member. Email lives in auth.users only.';
comment on column public.profiles.is_listed is 'When true, the public-safe fields appear in the member directory.';

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function private.touch_updated_at();

-- Create a profile whenever a user signs up.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;

create policy "Members read their own profile; admins read all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "Members update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Members can never change their own role: column-level privileges exclude it.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (
  full_name, headline, bio, location, avatar_url, website_url, linkedin_url,
  interests, skills, experience, business_idea, journey_stage, is_listed
) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Intake: applications, waitlist, newsletter, consultations, contact
-- ---------------------------------------------------------------------------
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  program_slug text not null check (char_length(program_slug) <= 80),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email = lower(email)),
  country text not null check (char_length(country) <= 80),
  linkedin_url text check (char_length(linkedin_url) <= 300),
  occupation text not null check (char_length(occupation) <= 160),
  background text not null
    check (background in ('aspiring', 'non_technical', 'corporate', 'engineer', 'beginner', 'other')),
  technical_level text not null
    check (technical_level in ('none', 'some', 'comfortable', 'professional')),
  idea_stage text not null
    check (idea_stage in ('no_idea', 'idea', 'validating', 'building', 'launched')),
  idea_summary text check (char_length(idea_summary) <= 3000),
  experience text check (char_length(experience) <= 3000),
  motivation text not null check (char_length(motivation) between 20 and 3000),
  weekly_hours text not null check (weekly_hours in ('under_5', '5_10', '10_20', 'over_20')),
  referral_source text check (char_length(referral_source) <= 200),
  status text not null default 'submitted'
    check (status in ('submitted', 'in_review', 'shortlisted', 'accepted', 'declined')),
  admin_notes text check (char_length(admin_notes) <= 5000),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index applications_status_idx on public.applications (status, created_at desc);
create index applications_user_idx on public.applications (user_id);

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email = lower(email)),
  program_slug text not null default 'founder-cohort' check (char_length(program_slug) <= 80),
  source text check (char_length(source) <= 80),
  created_at timestamptz not null default now(),
  unique (email, program_slug)
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254 and email = lower(email)),
  source text check (char_length(source) <= 80),
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz not null default now()
);

create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email = lower(email)),
  topic text not null
    check (topic in ('idea_validation', 'product_build', 'go_to_market', 'ai_strategy', 'other')),
  details text not null check (char_length(details) between 20 and 3000),
  availability text check (char_length(availability) <= 300),
  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'closed')),
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email = lower(email)),
  subject text not null check (char_length(subject) between 2 and 160),
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'new' check (status in ('new', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.applications enable row level security;
alter table public.waitlist_entries enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.contact_messages enable row level security;

-- Anyone may submit; nobody but the owner or an admin may read.
create policy "Anyone can submit an application"
  on public.applications for insert to anon, authenticated
  with check (
    status = 'submitted' and admin_notes is null and reviewed_at is null
    and (user_id is null or user_id = (select auth.uid()))
  );
create policy "Applicants read their own applications; admins read all"
  on public.applications for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "Admins update applications"
  on public.applications for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete applications"
  on public.applications for delete to authenticated
  using ((select private.is_admin()));

create policy "Anyone can join the waitlist"
  on public.waitlist_entries for insert to anon, authenticated
  with check (char_length(full_name) >= 2 and position('@' in email) > 1);
create policy "Admins read the waitlist"
  on public.waitlist_entries for select to authenticated
  using ((select private.is_admin()));
create policy "Admins delete waitlist entries"
  on public.waitlist_entries for delete to authenticated
  using ((select private.is_admin()));

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert to anon, authenticated
  with check (status = 'subscribed' and position('@' in email) > 1);
create policy "Admins read subscribers"
  on public.newsletter_subscribers for select to authenticated
  using ((select private.is_admin()));
create policy "Admins update subscribers"
  on public.newsletter_subscribers for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete subscribers"
  on public.newsletter_subscribers for delete to authenticated
  using ((select private.is_admin()));

create policy "Anyone can request a consultation"
  on public.consultation_requests for insert to anon, authenticated
  with check (status = 'new' and (user_id is null or user_id = (select auth.uid())));
create policy "Requesters read their own; admins read all"
  on public.consultation_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "Admins update consultation requests"
  on public.consultation_requests for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Anyone can send a message"
  on public.contact_messages for insert to anon, authenticated
  with check (status = 'new');
create policy "Admins read messages"
  on public.contact_messages for select to authenticated
  using ((select private.is_admin()));
create policy "Admins update messages"
  on public.contact_messages for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  title text not null check (char_length(title) between 3 and 160),
  kind text not null default 'workshop'
    check (kind in ('workshop', 'masterclass', 'founder_session', 'community')),
  summary text not null check (char_length(summary) <= 300),
  description text not null default '' check (char_length(description) <= 8000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text not null default 'Online' check (char_length(location) <= 160),
  capacity integer check (capacity is null or capacity > 0),
  is_published boolean not null default false,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index events_starts_at_idx on public.events (starts_at);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email = lower(email)),
  created_at timestamptz not null default now(),
  unique (event_id, email)
);
create index event_registrations_user_idx on public.event_registrations (user_id);

alter table public.events enable row level security;
alter table public.event_registrations enable row level security;

create policy "Published events are public; admins see drafts"
  on public.events for select to anon, authenticated
  using (is_published or (select private.is_admin()));
create policy "Admins create events"
  on public.events for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins update events"
  on public.events for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete events"
  on public.events for delete to authenticated
  using ((select private.is_admin()));

create policy "Members read their own registrations; admins read all"
  on public.event_registrations for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "Members cancel their own registrations; admins remove any"
  on public.event_registrations for delete to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- Registration goes through a function so capacity and timing are enforced
-- atomically, without exposing the attendee list to visitors.
create function public.register_for_event(p_event_id uuid, p_full_name text, p_email text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.events%rowtype;
  v_count integer;
  v_email text := lower(trim(p_email));
  v_name text := trim(p_full_name);
begin
  if char_length(v_name) < 2 or char_length(v_name) > 120
     or char_length(v_email) > 254
     or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return 'invalid';
  end if;

  select * into v_event from public.events
  where id = p_event_id and is_published
  for update;

  if not found or v_event.starts_at <= now() then
    return 'closed';
  end if;

  if exists (
    select 1 from public.event_registrations
    where event_id = p_event_id and email = v_email
  ) then
    return 'already_registered';
  end if;

  if v_event.capacity is not null then
    select count(*) into v_count from public.event_registrations where event_id = p_event_id;
    if v_count >= v_event.capacity then
      return 'full';
    end if;
  end if;

  insert into public.event_registrations (event_id, user_id, full_name, email)
  values (p_event_id, (select auth.uid()), v_name, v_email);

  return 'registered';
end;
$$;

revoke all on function public.register_for_event(uuid, text, text) from public;
grant execute on function public.register_for_event(uuid, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Resources
-- ---------------------------------------------------------------------------
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  title text not null check (char_length(title) between 3 and 160),
  kind text not null default 'article' check (kind in ('article', 'guide', 'tool', 'material')),
  summary text not null check (char_length(summary) <= 300),
  body text not null default '' check (char_length(body) <= 60000),
  external_url text check (char_length(external_url) <= 500),
  members_only boolean not null default false,
  is_published boolean not null default false,
  is_sample boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index resources_published_idx on public.resources (is_published, published_at desc);

create trigger resources_touch_updated_at
  before update on public.resources
  for each row execute function private.touch_updated_at();

alter table public.resources enable row level security;

create policy "Published public resources are readable by everyone"
  on public.resources for select to anon
  using (is_published and not members_only);
create policy "Members read all published resources; admins read drafts"
  on public.resources for select to authenticated
  using (is_published or (select private.is_admin()));
create policy "Admins create resources"
  on public.resources for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins update resources"
  on public.resources for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete resources"
  on public.resources for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- Member data: enrolments and projects
-- ---------------------------------------------------------------------------
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  program_slug text not null check (char_length(program_slug) <= 80),
  status text not null default 'active' check (status in ('active', 'completed', 'withdrawn')),
  created_at timestamptz not null default now(),
  unique (user_id, program_slug)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  one_liner text not null check (char_length(one_liner) between 5 and 200),
  description text check (char_length(description) <= 3000),
  url text check (char_length(url) <= 300),
  stage text not null default 'discover'
    check (stage in ('discover', 'validate', 'build', 'launch', 'grow')),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_owner_idx on public.projects (owner_id);

create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function private.touch_updated_at();

alter table public.enrollments enable row level security;
alter table public.projects enable row level security;

create policy "Members read their own enrolments; admins read all"
  on public.enrollments for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "Admins create enrolments"
  on public.enrollments for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins update enrolments"
  on public.enrollments for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete enrolments"
  on public.enrollments for delete to authenticated
  using ((select private.is_admin()));

create policy "Owners and admins read projects"
  on public.projects for select to authenticated
  using (owner_id = (select auth.uid()) or (select private.is_admin()));
create policy "Members create their own projects"
  on public.projects for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "Members update their own projects"
  on public.projects for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "Members delete their own projects; admins remove any"
  on public.projects for delete to authenticated
  using (owner_id = (select auth.uid()) or (select private.is_admin()));

-- ---------------------------------------------------------------------------
-- Community: safe, read-only projections for signed-in members
-- ---------------------------------------------------------------------------
create function public.member_directory()
returns table (
  id uuid,
  full_name text,
  headline text,
  bio text,
  location text,
  avatar_url text,
  website_url text,
  linkedin_url text,
  interests text[],
  skills text[],
  journey_stage text
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.full_name, p.headline, p.bio, p.location, p.avatar_url,
         p.website_url, p.linkedin_url, p.interests, p.skills, p.journey_stage
  from public.profiles p
  where p.is_listed and p.full_name <> '' and (select auth.uid()) is not null
  order by p.created_at desc
  limit 500;
$$;

create function public.community_projects()
returns table (
  id uuid,
  name text,
  one_liner text,
  description text,
  url text,
  stage text,
  owner_name text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select pr.id, pr.name, pr.one_liner, pr.description, pr.url, pr.stage,
         coalesce(nullif(p.full_name, ''), 'A member') as owner_name, pr.created_at
  from public.projects pr
  join public.profiles p on p.id = pr.owner_id
  where pr.is_public and (select auth.uid()) is not null
  order by pr.created_at desc
  limit 500;
$$;

revoke all on function public.member_directory() from public, anon;
revoke all on function public.community_projects() from public, anon;
grant execute on function public.member_directory() to authenticated;
grant execute on function public.community_projects() to authenticated;

-- ---------------------------------------------------------------------------
-- Admin helpers
-- ---------------------------------------------------------------------------
create function public.admin_list_members()
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  journey_stage text,
  is_listed boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Not authorised' using errcode = '42501';
  end if;
  return query
    select p.id, u.email::text, p.full_name, p.role, p.journey_stage, p.is_listed,
           p.created_at, u.last_sign_in_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.created_at desc;
end;
$$;

create function public.admin_set_role(p_user_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Not authorised' using errcode = '42501';
  end if;
  if p_role not in ('member', 'admin') then
    raise exception 'Unknown role';
  end if;
  if p_user_id = (select auth.uid()) and p_role <> 'admin' then
    raise exception 'You cannot remove your own admin access';
  end if;
  update public.profiles set role = p_role where id = p_user_id;
end;
$$;

revoke all on function public.admin_list_members() from public, anon;
revoke all on function public.admin_set_role(uuid, text) from public, anon;
grant execute on function public.admin_list_members() to authenticated;
grant execute on function public.admin_set_role(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: profile pictures
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Members see their own avatar files"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Members upload to their own avatar folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Members replace their own avatar files"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Members delete their own avatar files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
