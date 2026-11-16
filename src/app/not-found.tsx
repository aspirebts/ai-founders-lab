import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="wrap flex min-h-screen flex-col py-6">
      <Logo />
      <div className="flex flex-1 flex-col justify-center py-16">
        <p className="label text-signal-deep">Error 404</p>
        <h1 className="display display-xl mt-6">
          Nothing <em>here.</em>
        </h1>
        <p className="lede mt-8 max-w-lg text-ink-soft">
          The page you were looking for does not exist, or has moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/programs" size="lg" variant="outline">
            See the programmes
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
