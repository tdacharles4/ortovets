import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getArticleByHandle, getAllArticles } from "@/lib/shopify";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-dynamic";

const LANDING_TAGS = [
  "noticia-landing-page-1",
  "noticia-landing-page-2",
  "recursos-landing-page",
  "carrusel-noticiero",
];

interface PageProps {
  params: Promise<{ blogHandle: string; handle: string }>;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { blogHandle, handle } = await params;

  const [blog, allArticles] = await Promise.all([
    getArticleByHandle(blogHandle, handle, "no-store"),
    getAllArticles("no-store"),
  ]);

  if (!blog || !blog.articleByHandle) notFound();

  const article = blog.articleByHandle;
  const extract = stripHtml(article.contentHtml).slice(0, 300);
  const isDestacado = article.tags.some((t) => LANDING_TAGS.includes(t));
  const visibleTags = article.tags.filter((t) => !LANDING_TAGS.includes(t));

  // Related: other articles from same blog (exclude current), then fill with most recent
  const sameBlogArticles = blog.articles.edges
    .map((e) => ({ ...e.node, blogHandle: blog.handle, blogTitle: blog.title }))
    .filter((a) => a.handle !== handle);

  const related: typeof sameBlogArticles = [...sameBlogArticles.slice(0, 3)];

  if (related.length < 3) {
    const usedHandles = new Set([handle, ...related.map((a) => a.handle)]);
    const recent = allArticles
      .filter((a) => !usedHandles.has(a.handle))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    for (const a of recent) {
      if (related.length >= 3) break;
      related.push(a as typeof sameBlogArticles[number]);
    }
  }

  return (
    <div className="w-full">
      {/* Hero header */}
      <div className="relative w-full overflow-hidden" style={{ height: "400px" }}>
        {article.image ? (
          <Image
            src={article.image.url}
            alt={article.image.altText || article.title}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: "#2B4A7C" }} />
        )}
        <div className="absolute inset-0 bg-black/50" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between px-4 md:px-8 lg:px-16 py-5">

          {/* Top row: return button */}
          <Link
            href="/noticias"
            className="flex items-center gap-1 w-fit"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "140%",
              letterSpacing: "0%",
              color: "#F5F5F5",
            }}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
            Todos los recursos
          </Link>

          {/* Bottom: badges → title → date + tags */}
          <div className="flex flex-col gap-2">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span
                className="text-white text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#2B4A7C" }}
              >
                {blog.title}
              </span>
              {isDestacado && (
                <span
                  className="text-white text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#8CC63F" }}
                >
                  DESTACADO
                </span>
              )}
            </div>

            {/* Title */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "48px",
                lineHeight: "60px",
                letterSpacing: "0px",
                color: "#F5F5F5",
              }}
            >
              {article.title}
            </p>

            {/* Date + visible tags */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                letterSpacing: "0px",
                color: "#F5F5F5",
              }}
            >
              {formatDate(article.publishedAt)}
              {visibleTags.length > 0 && <span> · {visibleTags.join(" · ")}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 py-10 md:py-14">

        {/* Share button — upper left */}
        <div className="mb-6">
          <ShareButton title={article.title} />
        </div>

        {/* Extract */}
        <p className="text-[#757575] text-base leading-relaxed mb-6 max-w-3xl" style={{ fontFamily: "Inter, sans-serif" }}>
          {extract}{extract.length >= 300 ? "…" : ""}
        </p>

        <Separator className="mb-6" />

        {/* Title */}
        <h1
          className="font-bold text-[#1E1E1E] mb-8"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: "1.2" }}
        >
          {article.title}
        </h1>

        {/* Content HTML */}
        <div
          className="max-w-3xl text-[#1E1E1E] article-content"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "1.75" }}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Recursos Relacionados */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2
              className="font-bold text-[#1E1E1E] mb-8"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
            >
              Recursos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={`${rel.blogHandle}-${rel.handle}`}
                  href={`/noticias/${rel.blogHandle}/${rel.handle}`}
                  className="flex flex-col rounded-2xl overflow-hidden border border-[#E5E5E5] bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Card image — 576x324 aspect ratio (16:9) */}
                  <div className="relative w-full bg-muted" style={{ aspectRatio: "576 / 324" }}>
                    {rel.image ? (
                      <Image
                        src={rel.image.url}
                        alt={rel.image.altText || rel.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  {/* Card info */}
                  <div className="p-4 flex flex-col gap-1">
                    <p className="text-[#757575] text-xs">{formatDate(rel.publishedAt)}</p>
                    <p className="font-bold text-[#1E1E1E] text-sm leading-snug line-clamp-2">{rel.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
