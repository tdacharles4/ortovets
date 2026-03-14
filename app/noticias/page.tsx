import { getAllArticles } from "@/lib/shopify";
import { NoticiasClient } from "@/components/NoticiasClient";

export default async function Noticias() {
  const articles = await getAllArticles("no-store");

  return (
    <div className="w-full max-w-[1920px] mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-16">
      <NoticiasClient articles={articles} />
    </div>
  );
}
