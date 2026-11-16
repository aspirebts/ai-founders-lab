-- Sample content for local development and first launch.
-- Every row is flagged is_sample = true and is labelled "Sample" in the UI.
-- Replace or delete these from the admin area once real content exists.

insert into public.events (slug, title, kind, summary, description, starts_at, ends_at, location, capacity, is_published, is_sample)
values
  (
    'finding-a-problem-worth-solving',
    'Finding a problem worth solving',
    'workshop',
    'A working session on spotting business opportunities that one person with AI can realistically serve.',
    E'## What we will cover\n\n- Where one-person business opportunities tend to hide\n- A simple scoring sheet for comparing ideas\n- Using AI research tools to size a niche in an afternoon\n\n## Who it is for\n\nAnyone at the Discover stage. No technical background needed.\n\n## Format\n\n60 minutes of teaching, 30 minutes of working time with feedback.',
    date_trunc('hour', now()) + interval '14 days' + interval '17 hours',
    date_trunc('hour', now()) + interval '14 days' + interval '18 hours 30 minutes',
    'Online', 150, true, true
  ),
  (
    'from-prompt-to-prototype',
    'From prompt to prototype in a weekend',
    'masterclass',
    'A build-along masterclass: take a validated idea and produce a working first version using AI tools.',
    E'## What we will cover\n\n- Choosing the smallest version worth building\n- A practical AI-assisted build workflow for non-programmers\n- What to check before you show it to a customer\n\n## Who it is for\n\nFounders at the Validate or Build stage.',
    date_trunc('hour', now()) + interval '28 days' + interval '16 hours',
    date_trunc('hour', now()) + interval '28 days' + interval '18 hours',
    'Online', 100, true, true
  ),
  (
    'founder-session-first-ten-customers',
    'Founder session: the first ten customers',
    'founder_session',
    'An open conversation about getting early customers without an audience, an ad budget, or a sales team.',
    E'## Format\n\nA moderated discussion followed by open questions. Bring a specific customer problem you are stuck on.',
    date_trunc('hour', now()) + interval '42 days' + interval '18 hours',
    date_trunc('hour', now()) + interval '42 days' + interval '19 hours',
    'Online', null, true, true
  ),
  (
    'community-demo-night',
    'Community demo night',
    'community',
    'Members show what they are building. Five minutes each, honest feedback, no slides required.',
    E'## How it works\n\nMembers sign up to demo in the portal. Everyone else is welcome to watch and give feedback.',
    date_trunc('hour', now()) + interval '56 days' + interval '18 hours',
    date_trunc('hour', now()) + interval '56 days' + interval '19 hours 30 minutes',
    'Online', null, true, true
  )
on conflict (slug) do nothing;

insert into public.resources (slug, title, kind, summary, body, external_url, members_only, is_published, is_sample, published_at)
values
  (
    'the-one-person-business-thesis',
    'The one-person business thesis',
    'article',
    'Why AI changes the minimum team size of a real company, and what that means for how you start.',
    E'For most of business history, a company needed people before it needed customers. Someone had to design, someone had to build, someone had to sell, someone had to keep the books.\n\nAI does not remove that work. It changes who can do it.\n\n## What has changed\n\nA single person can now draft, design, prototype, analyse, and support at a level that used to require several specialists. The cost of a first version has fallen from months and salaries to days and subscriptions.\n\n## What has not changed\n\n- You still need a real problem.\n- You still need someone willing to pay.\n- You still need to ship, listen, and repeat.\n\n## What this means for you\n\nStart smaller than feels serious. Pick one customer, one problem, one product. Let AI carry the breadth while you supply the judgement.\n\nThat is the approach we teach in every programme.',
    null, false, true, true, now() - interval '6 days'
  ),
  (
    'idea-validation-checklist',
    'A 10-point idea validation checklist',
    'guide',
    'Ten questions to answer before you build anything. Most ideas fail three of them.',
    E'Work through these in order. Write your answers down; vague answers are a signal.\n\n1. **Who exactly has this problem?** Name a role, not a market.\n2. **How do they solve it today?** "Nothing" is rarely true.\n3. **What does the current solution cost them** in money, time, or risk?\n4. **Have five of them told you this unprompted?**\n5. **Would they pay before it exists?** Ask.\n6. **Can you reach fifty of them** without paid advertising?\n7. **Can you build a first version alone** in under four weeks?\n8. **What would make this ten times better**, not ten percent?\n9. **Why now?** What changed that makes this possible?\n10. **Do you want to work on this for three years?**\n\nIf you cannot answer 1, 2, and 5 with evidence, you are still at the Discover stage. That is fine. It is cheaper to learn it now.',
    null, false, true, true, now() - interval '4 days'
  ),
  (
    'choosing-your-ai-build-stack',
    'Choosing your AI build stack',
    'tool',
    'A plain-language map of the tool categories a solo founder needs, and how to pick one from each.',
    E'You do not need many tools. You need one good choice in each of five categories.\n\n## The five categories\n\n- **Thinking partner**: a general AI assistant for research, writing, and analysis.\n- **Builder**: an AI coding tool or app builder that turns descriptions into working software.\n- **Data**: a hosted database with authentication built in.\n- **Payments**: a provider that handles checkout, tax, and invoices.\n- **Distribution**: one channel where your customers already spend time.\n\n## How to choose\n\nPick the tool with the best documentation, not the longest feature list. You will spend more time reading than clicking.\n\nMembers get our current tool recommendations and setup walkthroughs inside the portal.',
    null, false, true, true, now() - interval '2 days'
  ),
  (
    'cohort-week-one-workbook',
    'Cohort workbook: week one',
    'material',
    'The opportunity-mapping exercises used in the first week of the founder cohort.',
    E'## Exercise 1: Your unfair starting point\n\nList ten things you know from work or life that most people do not.\n\n## Exercise 2: Problems you have paid to solve\n\nList every tool, service, or person you paid in the last year to make a problem go away.\n\n## Exercise 3: The overlap\n\nCircle anything that appears in both lists. Those are your first candidate opportunities.\n\n## Exercise 4: One conversation\n\nBefore next week, talk to one person who has the problem you circled. Do not pitch. Ask how they deal with it today.',
    null, true, true, true, now() - interval '1 day'
  )
on conflict (slug) do nothing;
