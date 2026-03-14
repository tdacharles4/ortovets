import Image from "next/image";
import Link from "next/link";

const LANDING_TAGS = [
  "noticia-landing-page-1",
  "noticia-landing-page-2",
  "recursos-landing-page",
  "carrusel-noticiero",
];

type ArticleCardProps = {
  handle: string;
  blogHandle: string;
  blogTitle: string;
  title: string;
  contentHtml: string;
  publishedAt: string;
  tags: string[];
  image: { url: string; altText: string | null } | null;
  isDestacado?: boolean;
};

export function ArticleCard({ handle, blogHandle, blogTitle, title, contentHtml, publishedAt, tags, image, isDestacado }: ArticleCardProps) {
  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(publishedAt));

  const extract = contentHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const visibleTags = tags.filter(t => !LANDING_TAGS.includes(t));

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#E5E5E5] bg-white shadow-md w-full h-[593px]">

      {/* Image */}
      <div className="relative w-full h-[296px] shrink-0 bg-muted">
        {image ? (
          <Image src={image.url} alt={image.altText || title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Sin imagen
          </div>
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-4 pointer-events-none">
          <span className="text-white text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#2B4A7C" }}>
            {blogTitle}
          </span>
          {isDestacado && (
            <span className="text-white text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#8CC63F" }}>
              DESTACADO
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-6 flex-1 overflow-hidden">
        <p className="text-[#757575] text-xs font-normal shrink-0">{formattedDate}</p>
        <h3 className="text-[#1E1E1E] font-bold text-base leading-snug line-clamp-2 shrink-0">{title}</h3>
        <p className="text-[#757575] overflow-hidden" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "24px", letterSpacing: "0px", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3 }}>{extract}</p>
        <div className="flex flex-col gap-4 mt-auto shrink-0">
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleTags.map(tag => (
                <span key={tag} className="text-xs bg-[#F5F5F5] text-[#757575] px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/noticias/${blogHandle}/${handle}`}
            className="font-semibold text-xs hover:underline w-fit"
            style={{ color: "#2B4A7C" }}
          >
            Leer más →
          </Link>
        </div>
      </div>

    </div>
  );
}
