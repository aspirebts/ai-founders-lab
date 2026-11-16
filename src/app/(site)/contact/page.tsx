import type { Metadata } from "next";
import { Eyebrow, PageHeader } from "@/components/ui/bits";
import { ConsultationForm, ContactForm } from "@/components/forms/contact-forms";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AI Founders Lab, or request a paid one-on-one consultation.",
};

export default function ContactPage() {
  const email = env.contactEmail;
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Talk to <em>the Lab.</em>
          </>
        }
        lede="Send us a question, or request a one-on-one consultation for personalised guidance on your idea, product or launch."
      >
        <nav aria-label="On this page" className="label flex flex-wrap gap-x-6 gap-y-2">
          <a href="#consultation" className="link">
            Request a consultation
          </a>
          <a href="#message" className="link">
            Send a message
          </a>
        </nav>
      </PageHeader>

      <section id="consultation" className="wrap grid scroll-mt-20 gap-12 border-b border-line py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Eyebrow index="01" className="text-muted">
            One-on-one consultations
          </Eyebrow>
          <h2 className="display display-md mt-6">Personalised guidance, when you need it.</h2>
          <div className="mt-6 max-w-md space-y-4 text-ink-soft">
            <p>
              Consultations are paid, individual sessions for founders who want focused advice on their
              own situation.
            </p>
            <p>
              Tell us what you need. We will reply by email with availability and the fee before
              anything is booked. Submitting this form does not commit you to anything and no payment is
              taken here.
            </p>
          </div>
          <dl className="mt-8 max-w-md border-t border-ink text-[0.95rem]">
            {[
              ["Format", "Online video call"],
              ["Cost", "Paid; fee confirmed by email"],
              ["Good for", "Idea validation, build plans, launch strategy"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr] border-b border-line py-3">
                <dt className="label pt-0.5 text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ConsultationForm />
        </div>
      </section>

      <section id="message" className="wrap grid scroll-mt-20 gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Eyebrow index="02" className="text-muted">
            General enquiries
          </Eyebrow>
          <h2 className="display display-md mt-6">Send a message.</h2>
          <p className="mt-6 max-w-md text-ink-soft">
            Questions about programmes, events, partnerships or anything else. We reply by email.
          </p>
          {email && (
            <p className="mt-8">
              <span className="label block text-muted">Email</span>
              <a href={`mailto:${email}`} className="display display-sm link mt-1 inline-block break-all">
                {email}
              </a>
            </p>
          )}
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
