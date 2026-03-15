"use client";

import * as React from "react";
import { Share2, Facebook, Twitter, Link, Check } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Encontré este artículo interesante de Ortovets: "${title}". Puedes leerlo aquí: ${url}`;

  function shareOnFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
    setOpen(false);
  }

  function shareOnX() {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
    setOpen(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm transition-colors"
        style={{
          borderColor: "#2B4A7C",
          color: "#2B4A7C",
          backgroundColor: "white",
        }}
      >
        <Share2 size={15} />
        Compartir
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 rounded-xl border border-[#E5E5E5] bg-white shadow-lg overflow-hidden"
          style={{ minWidth: "180px" }}
        >
          <button
            onClick={shareOnFacebook}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#1E1E1E] hover:bg-[#F5F5F5] transition-colors"
          >
            <Facebook size={16} className="text-[#1877F2]" />
            Facebook
          </button>
          <button
            onClick={shareOnX}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#1E1E1E] hover:bg-[#F5F5F5] transition-colors border-t border-[#F0F0F0]"
          >
            <Twitter size={16} className="text-[#1DA1F2]" />
            X (Twitter)
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#1E1E1E] hover:bg-[#F5F5F5] transition-colors border-t border-[#F0F0F0]"
          >
            {copied ? <Check size={16} className="text-[#8CC63F]" /> : <Link size={16} className="text-[#757575]" />}
            {copied ? "¡Enlace copiado!" : "Copiar enlace"}
          </button>
        </div>
      )}
    </div>
  );
}
