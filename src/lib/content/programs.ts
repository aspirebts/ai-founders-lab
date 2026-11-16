/**
 * Programmes are defined in code for the first version: they change rarely,
 * and keeping them here keeps the public pages fully static. To add a
 * programme, add an entry below. Applications, waitlist entries and enrolments
 * reference programmes by `slug`.
 */
export type Program = {
  slug: string;
  index: string;
  name: string;
  kind: "Cohort" | "Bootcamp";
  status: string;
  price: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  summary: string;
  description: string[];
  facts: { label: string; value: string }[];
  youWill: string[];
  structure: { title: string; body: string }[];
  forWho: string[];
};

export const programs: Program[] = [
  {
    slug: "founder-cohort",
    index: "01",
    name: "Founder Cohort",
    kind: "Cohort",
    status: "Applications open",
    price: "Free",
    cta: { label: "Apply to the cohort", href: "/apply?program=founder-cohort" },
    secondaryCta: { label: "Join the waitlist", href: "/waitlist?program=founder-cohort" },
    summary:
      "A structured programme that takes you from idea to a launched, revenue-generating business, alongside a small group of other founders.",
    description: [
      "The Founder Cohort is the core of AI Founders Lab. It is an incubator run as a programme: you join a group of founders, work through the five stages of the founder journey together, and leave with a real product in the market.",
      "Each stage has a clear milestone. You are accountable to the group for reaching it, and the group is there to help you do so. The work is practical from the first week.",
    ],
    facts: [
      { label: "Format", value: "Online, live sessions and weekly milestones" },
      { label: "Cost", value: "Free for the first cohorts" },
      { label: "Start date", value: "To be announced" },
      { label: "Admission", value: "By application" },
    ],
    youWill: [
      "Develop and stress-test a business idea",
      "Validate it with real customers before building",
      "Build a working product using AI tools",
      "Launch and win your first paying customers",
      "Leave with a plan to reach profitability",
    ],
    structure: [
      { title: "Discover", body: "Map opportunities and choose a problem worth solving." },
      { title: "Validate", body: "Gather evidence from customers that the idea has demand." },
      { title: "Build", body: "Create the first version with an AI-assisted workflow." },
      { title: "Launch", body: "Go to market, set pricing, and take payment." },
      { title: "Grow", body: "Automate, find repeatable acquisition, work towards profit." },
    ],
    forWho: [
      "People ready to commit regular weekly time to building a business",
      "Founders with an idea, and founders still looking for one",
      "Technical and non-technical backgrounds alike",
    ],
  },
  {
    slug: "ai-startup-bootcamp",
    index: "02",
    name: "AI Startup Bootcamp",
    kind: "Bootcamp",
    status: "Waitlist open",
    price: "Free",
    cta: { label: "Join the bootcamp waitlist", href: "/waitlist?program=ai-startup-bootcamp" },
    summary:
      "Short, intensive, practical training in using AI to create products. Learn the tools and the workflow by building something real.",
    description: [
      "Bootcamps are focused and hands-on. Where the cohort covers the whole founder journey, a bootcamp concentrates on one thing: using AI to turn a product idea into something that works.",
      "You will learn by doing. Each session ends with something built, and you finish the bootcamp with a working prototype and the confidence to keep going on your own.",
    ],
    facts: [
      { label: "Format", value: "Online, intensive, build-along sessions" },
      { label: "Cost", value: "Free for the first bootcamps" },
      { label: "Dates", value: "To be announced" },
      { label: "Admission", value: "Open, via the waitlist" },
    ],
    youWill: [
      "Understand what current AI tools can and cannot do",
      "Learn a repeatable workflow for building with AI",
      "Build a working prototype of your own product",
      "Know how to test it with real users",
    ],
    structure: [
      { title: "Foundations", body: "The AI tool landscape, explained without jargon." },
      { title: "Workflow", body: "From a plain-language description to working software." },
      { title: "Build", body: "Guided build sessions on your own product idea." },
      { title: "Ship", body: "Put the prototype online and collect first feedback." },
    ],
    forWho: [
      "Beginners who want a practical introduction to building with AI",
      "Professionals exploring what AI makes possible in their field",
      "Founders who want to sharpen their build skills before a cohort",
    ],
  },
];

export const futurePrograms = [
  {
    name: "Self-paced courses",
    body: "The cohort curriculum as on-demand lessons, for founders who need to learn on their own schedule.",
  },
  {
    name: "Specialist tracks",
    body: "Focused programmes for building AI businesses in particular industries and product categories.",
  },
  {
    name: "Growth programme",
    body: "For founders with a launched product: operations, automation and acquisition at the Grow stage.",
  },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}

export function programName(slug: string) {
  return getProgram(slug)?.name ?? slug;
}

export const programSlugs = programs.map((p) => p.slug) as [string, ...string[]];
