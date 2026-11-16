import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What information AI Founders Lab collects through this website and how it is used.",
};

const sections = [
  {
    title: "What we collect",
    items: [
      "Waitlist: your name, email address and the programme you are interested in.",
      "Newsletter: your email address.",
      "Applications: the details you enter in the application form, including your background, your idea and your motivation.",
      "Consultation requests and messages: your name, email address and what you write to us.",
      "Event registrations: your name and email address, linked to the event.",
      "Member accounts: your email address, a securely hashed password, and whatever you choose to add to your profile, including an optional photo and projects.",
    ],
  },
  {
    title: "How we use it",
    items: [
      "To review applications and run programmes, events and consultations.",
      "To contact you about the thing you signed up for.",
      "To send the newsletter, if you subscribed.",
      "To operate member accounts and the member portal.",
    ],
  },
  {
    title: "Who can see it",
    items: [
      "Applications, waitlist entries, subscriptions, registrations and messages are visible only to AI Founders Lab administrators.",
      "Your member profile is private by default. If you choose to be listed in the member directory, your name, headline, bio, location, links, skills, interests and stage are shown to other signed-in members. Your email address, experience notes and business idea are never shown in the directory.",
      "Projects are private unless you mark them as shared with members.",
      "We do not sell personal information.",
    ],
  },
  {
    title: "Your choices",
    items: [
      "You can edit your profile, remove your photo, or delete your projects at any time in the member portal.",
      "You can ask us to unsubscribe you, correct your information, or delete it, through the contact page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy notice"
        lede="A plain-language summary of the information this website collects and what happens to it."
      />
      <section className="wrap py-14 md:py-20">
        <div className="max-w-3xl">
          {sections.map((s, i) => (
            <div key={s.title} className="grid gap-4 border-t border-ink py-8 md:grid-cols-[12rem_1fr]">
              <h2 className="font-medium">
                <span className="label mr-3 text-muted">0{i + 1}</span>
                {s.title}
              </h2>
              <ul className="space-y-3 text-ink-soft">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="border-t border-ink pt-8 text-ink-soft">
            Questions about your information?{" "}
            <Link href="/contact#message" className="link">
              Contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
