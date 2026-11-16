import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { journey } from "@/lib/content/site";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <main id="main" className="flex flex-col px-5 py-6 md:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="label link text-muted">
            ← Back to site
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-14">{children}</div>
      </main>

      <aside className="on-ink hidden flex-col justify-between p-12 lg:flex">
        <p className="label text-muted-dark">Member portal</p>
        <div>
          <p className="display display-lg">
            Build a company <em className="text-signal">of one.</em>
          </p>
          <ol className="mt-12 border-t border-line-dark">
            {journey.map((s) => (
              <li key={s.id} className="flex items-baseline gap-5 border-b border-line-dark py-3.5">
                <span className="label text-signal">{s.index}</span>
                <span className="font-medium">{s.name}</span>
                <span className="ml-auto text-sm text-muted-dark">{s.line}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="label text-muted-dark">Online school · Startup incubator · Founder community</p>
      </aside>
    </div>
  );
}
