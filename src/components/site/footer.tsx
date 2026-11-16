import Link from "next/link";
import { Mark } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { mainNav, site } from "@/lib/content/site";

const columns = [
  { title: "Explore", links: mainNav },
  {
    title: "Join",
    links: [
      { href: "/apply", label: "Apply to a cohort" },
      { href: "/waitlist", label: "Join the waitlist" },
      { href: "/contact#consultation", label: "Book a consultation" },
      { href: "/register", label: "Create an account" },
      { href: "/login", label: "Member sign in" },
    ],
  },
  {
    title: "Lab",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/brand", label: "Brand" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="on-ink mt-auto">
      <div className="wrap grid gap-14 border-b border-line-dark py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label text-muted-dark">The Lab Notes</p>
          <p className="display display-sm mt-4 max-w-md">
            Practical writing on building one-person businesses with AI.
          </p>
          <div className="mt-7 max-w-md">
            <NewsletterForm source="footer" inverted />
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="label text-muted-dark">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-signal">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="wrap overflow-hidden pt-10">
        <p aria-hidden="true" className="display select-none text-[clamp(3rem,13.4vw,13rem)] leading-[0.8] whitespace-nowrap">
          Company <em>of one.</em>
        </p>
      </div>

      <div className="wrap flex flex-col gap-4 py-8 text-sm text-muted-dark sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex items-center gap-3"
          style={{ "--mark-bg": "#f3efe6", "--mark-fg": "#11110f" } as React.CSSProperties}
        >
          <Mark size={22} />
          <span>© 2026 {site.name}</span>
        </div>
        <p className="label">Online school · Startup incubator · Founder community</p>
      </div>
    </footer>
  );
}
