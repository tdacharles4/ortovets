import { getAllArticles } from "@/lib/shopify";
import { NoticiasClient } from "@/components/NoticiasClient";

export const dynamic = 'force-dynamic';

export default async function Noticias({ searchParams }: { searchParams?: Promise<{ blog?: string }> }) {
  const [articles, params] = await Promise.all([
    getAllArticles("no-store"),
    searchParams,
  ]);

  return (
    <div className="w-full max-w-[1920px] mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-16">
      <NoticiasClient articles={articles} initialBlog={params?.blog ?? null} />
    </div>
  );
}
