"use client";

import * as React from "react";
import { ArticleCard } from "@/components/ArticleCard";

const LANDING_TAGS = [
  "noticia-landing-page-1",
  "noticia-landing-page-2",
  "recursos-landing-page",
  "carrusel-noticiero",
];

type Article = {
  handle: string;
  blogHandle: string;
  blogTitle: string;
  title: string;
  contentHtml: string;
  publishedAt: string;
  tags: string[];
  image: { url: string; altText: string | null } | null;
};

export function NoticiasClient({ articles }: { articles: Article[] }) {
  const [selectedBlog, setSelectedBlog] = React.useState<string | null>(null);

  // Derive unique blogs with counts
  const blogs = React.useMemo(() => {
    const map = new Map<string, { title: string; count: number }>();
    for (const a of articles) {
      const existing = map.get(a.blogHandle);
      if (existing) {
        existing.count++;
      } else {
        map.set(a.blogHandle, { title: a.blogTitle, count: 1 });
      }
    }
    return Array.from(map.entries()).map(([handle, { title, count }]) => ({ handle, title, count }));
  }, [articles]);

  const filtered = selectedBlog
    ? articles.filter(a => a.blogHandle === selectedBlog)
    : articles;

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedBlog(null)}
          className="px-4 py-2 rounded-full transition-colors text-center"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0px",
            backgroundColor: selectedBlog === null ? "#2B4A7C" : "#ffffff",
            color: selectedBlog === null ? "#ffffff" : "#364153",
          }}
        >
          Todos ({articles.length})
        </button>
        {blogs.map(blog => (
          <button
            key={blog.handle}
            onClick={() => setSelectedBlog(blog.handle)}
            className="px-4 py-2 rounded-full transition-colors text-center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0px",
              backgroundColor: selectedBlog === blog.handle ? "#2B4A7C" : "#ffffff",
              color: selectedBlog === blog.handle ? "#ffffff" : "#1E1E1E",
            }}
          >
            {blog.title} ({blog.count})
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((article) => (
          <ArticleCard
            key={`${article.blogHandle}-${article.handle}`}
            handle={article.handle}
            blogHandle={article.blogHandle}
            blogTitle={article.blogTitle}
            title={article.title}
            contentHtml={article.contentHtml}
            publishedAt={article.publishedAt}
            tags={article.tags}
            image={article.image}
            isDestacado={article.tags.some(t => LANDING_TAGS.includes(t))}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No se encontraron artículos.</p>
        </div>
      )}
    </div>
  );
}
