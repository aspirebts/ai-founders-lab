import { notFound } from "next/navigation";
import { ResourceArticle } from "@/components/site/resource-article";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResourceRow } from "@/lib/types";

export default async function PortalResourcePage({ params }: PageProps<"/portal/resources/[slug]">) {
  await requireUser();
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="-mx-5 -my-8 md:-mx-10 md:-my-12 [&_.wrap]:max-w-none">
      <ResourceArticle resource={data as ResourceRow} back={{ href: "/portal/resources", label: "Library" }} />
    </div>
  );
}
