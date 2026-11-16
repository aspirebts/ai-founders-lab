import { Suspense } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AccountLink, AccountLinkFallback } from "@/components/site/account-link";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header
        account={
          <Suspense fallback={<AccountLinkFallback />}>
            <AccountLink />
          </Suspense>
        }
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
