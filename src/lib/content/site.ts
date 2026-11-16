import type { JourneyStage } from "@/lib/types";

export const site = {
  name: "AI Founders Lab",
  tagline: "Build a company of one.",
  description:
    "AI Founders Lab is an online school, startup incubator and founder community for people building profitable one-person businesses with AI.",
};

export const mainNav = [
  { href: "/programs", label: "Programs" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/community", label: "Community" },
  { href: "/events", label: "Events" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export type Stage = {
  id: JourneyStage;
  index: string;
  name: string;
  line: string;
  body: string;
  activities: string[];
  outcome: string;
};

export const journey: Stage[] = [
  {
    id: "discover",
    index: "01",
    name: "Discover",
    line: "Identify business opportunities.",
    body: "Start from what you know. We help you map your experience, spot problems worth solving, and use AI research tools to see where a single founder can realistically win.",
    activities: [
      "Map your skills, industry knowledge and access",
      "Research niches and customer problems with AI",
      "Shortlist opportunities against clear criteria",
    ],
    outcome: "A shortlist of opportunities you are well placed to pursue.",
  },
  {
    id: "validate",
    index: "02",
    name: "Validate",
    line: "Test and validate ideas.",
    body: "Before you build anything, find out whether anyone wants it. You will talk to real customers, run small tests, and learn to read the evidence honestly.",
    activities: [
      "Customer conversations that surface real demand",
      "Quick tests: landing pages, pre-sales, pilots",
      "A go or no-go decision based on evidence",
    ],
    outcome: "One idea with evidence that people will pay for it.",
  },
  {
    id: "build",
    index: "03",
    name: "Build",
    line: "Use AI to create products.",
    body: "Turn the validated idea into a working product. You will learn a practical AI-assisted build workflow that works whether or not you have ever written code.",
    activities: [
      "Scope the smallest version worth shipping",
      "Build with AI tools, with guidance at each step",
      "Test with early users and refine",
    ],
    outcome: "A working first version in the hands of real users.",
  },
  {
    id: "launch",
    index: "04",
    name: "Launch",
    line: "Bring products to market.",
    body: "Put the product in front of customers and start charging. We cover positioning, pricing, your first channel, and the mechanics of taking payment.",
    activities: [
      "Positioning and pricing you can defend",
      "A launch plan built around one channel",
      "Your first paying customers",
    ],
    outcome: "A product on the market with revenue coming in.",
  },
  {
    id: "grow",
    index: "05",
    name: "Grow",
    line: "Build profitable AI-enabled businesses.",
    body: "Make it sustainable. Use AI to run operations, support and marketing so the business grows without you needing to hire a team to keep up.",
    activities: [
      "Automate operations and support with AI",
      "Build repeatable acquisition",
      "Manage for profit, not just revenue",
    ],
    outcome: "A profitable business you can run on your own terms.",
  },
];

export const stageLabel: Record<JourneyStage, string> = {
  discover: "Discover",
  validate: "Validate",
  build: "Build",
  launch: "Launch",
  grow: "Grow",
};

export const audiences = [
  {
    name: "Aspiring entrepreneurs",
    body: "You have an idea, or several, and want a structured way to turn one into a business.",
  },
  {
    name: "Non-technical founders",
    body: "You understand a market or a customer. AI can now cover the building you could not do alone.",
  },
  {
    name: "Corporate professionals",
    body: "You have deep industry knowledge and want to build something of your own alongside, or after, your career.",
  },
  {
    name: "AI engineers and developers",
    body: "You can build. We help with the other half: customers, positioning, pricing and revenue.",
  },
  {
    name: "Complete beginners",
    body: "You are new to both AI and business. Start here; we assume nothing and explain everything.",
  },
];

/**
 * SAMPLE CONTENT. These are illustrative examples of the kind of one-person
 * businesses the programmes are designed to produce. They are not real
 * companies or real members. Replace with real showcases when available.
 */
export const sampleShowcase = [
  {
    name: "Ledgerline",
    category: "Bookkeeping assistant",
    summary:
      "An AI assistant that turns a freelancer's bank feed into categorised books and a quarterly tax summary.",
    founder: "A former accountant",
    stage: "launch" as JourneyStage,
  },
  {
    name: "Tutorloop",
    category: "Education",
    summary:
      "Personalised exam practice for secondary school students, generated from each school's own syllabus.",
    founder: "A teacher with no coding background",
    stage: "build" as JourneyStage,
  },
  {
    name: "Clausewise",
    category: "Legal operations",
    summary:
      "Contract review for small property managers: flags unusual clauses and drafts a plain-language summary.",
    founder: "A paralegal",
    stage: "grow" as JourneyStage,
  },
];

export const labels = {
  eventKind: {
    workshop: "Workshop",
    masterclass: "Masterclass",
    founder_session: "Founder session",
    community: "Community event",
  },
  resourceKind: {
    article: "Article",
    guide: "Guide",
    tool: "AI tools",
    material: "Learning material",
  },
  applicationStatus: {
    submitted: "Submitted",
    in_review: "In review",
    shortlisted: "Shortlisted",
    accepted: "Accepted",
    declined: "Declined",
  },
  background: {
    aspiring: "Aspiring entrepreneur with an idea",
    non_technical: "Non-technical founder",
    corporate: "Corporate professional",
    engineer: "AI engineer or developer",
    beginner: "Complete beginner",
    other: "Something else",
  },
  technicalLevel: {
    none: "None: I have never built software",
    some: "Some: I have used no-code or AI tools",
    comfortable: "Comfortable: I can build simple things",
    professional: "Professional: I build software for a living",
  },
  ideaStage: {
    no_idea: "I do not have an idea yet",
    idea: "I have an idea",
    validating: "I am testing an idea with customers",
    building: "I am building a product",
    launched: "I have launched",
  },
  weeklyHours: {
    under_5: "Under 5 hours",
    "5_10": "5 to 10 hours",
    "10_20": "10 to 20 hours",
    over_20: "More than 20 hours",
  },
  consultationTopic: {
    idea_validation: "Validating an idea",
    product_build: "Building a product with AI",
    go_to_market: "Launch and go-to-market",
    ai_strategy: "AI strategy for an existing business",
    other: "Something else",
  },
} as const;
