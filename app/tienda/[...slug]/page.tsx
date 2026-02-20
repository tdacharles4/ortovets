import { getProduct } from "@/lib/shopify";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { ProductPageContent } from "@/components/ProductPageContent";
import { ReviewCard } from "@/components/ui/ReviewCard";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const handle = resolvedParams.slug[resolvedParams.slug.length - 1];
  
  const { body } = await getProduct(handle);
  const product = body.data.product;

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header Frame - 1920w fill 68h hug */}
      <header className="w-full h-[68px] pt-[4px] pr-[64px] pb-0 pl-[64px] flex items-center gap-[10px]">
        {/* Button: Todos los productos - Text only with arrow */}
        <Link 
          href="/tienda"
          className="flex items-center gap-[8px] bg-transparent border-none p-0 transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="w-5 h-5 text-[#14AE5C]" />
          <span className="font-sans font-semibold text-lg leading-[1.4] text-[#14AE5C]">
            Todos los productos
          </span>
        </Link>
      </header>

      {/* Product Page Frame - vertical flow 1920w fill */}
      <main className="w-full max-w-[1920px] min-w-[240px] flex flex-col gap-[6px] mx-auto overflow-x-hidden">
        {/* PP Content Frame - section 1792 fill width 736h hug padding leftright 64px */}
        <div className="w-full px-[64px]">
          <div className="w-full max-w-[1792px] h-fit min-h-[736px]">
            <ProductPageContent product={product} />
          </div>
        </div>

        {/* Reviews Grid Frame - 1920w fill 326h hug padding topbottom 24px rightleft 64px gap 8px */}
        <section className="w-full h-auto min-h-[326px] py-[24px] px-[64px] flex flex-col gap-[8px] bg-white mt-12">
          {/* Text Heading: Reseñas más recientes - SemiBold Base 120% */}
          <h2 className="text-[#1E1E1E] font-sans font-semibold text-2xl leading-[1.2]">
            Reseñas más recientes
          </h2>
          
          {/* Reviews Frame - Horizontal list of 3 cards */}
          <div className="flex flex-row gap-[32px] w-full mt-4 overflow-x-auto pb-4">
            <ReviewCard />
            <ReviewCard />
            <ReviewCard />
          </div>
        </section>

        {/* Videos Recomendados Frame - 1920w fill 534h fixed padding top 24px rightleftbottom 64px gap 24px opacity 80% */}
        <section className="w-full h-[534px] pt-[24px] px-[64px] pb-[64px] flex flex-col gap-[24px] bg-white opacity-80 mt-12 mb-20">
          {/* Text Heading: Videos Recomendados - SemiBold Base 120% */}
          <h2 className="text-[#1E1E1E] font-sans font-semibold text-2xl leading-[1.2]">
            Videos Recomendados
          </h2>

          {/* Videos Content Frame - 1792w 377h fill gap 48px horizontal */}
          <div className="flex flex-row w-full max-w-[1792px] h-[377px] gap-[48px]">
            {/* Video Frame 1 - 872w fill 404h hug gap 8px */}
            <div className="flex flex-col flex-1 h-fit gap-[8px]">
              <h3 className="text-[#5A5A5A] font-sans font-semibold italic text-lg leading-[1.2]">
                Video 1 Title
              </h3>
              <div className="relative w-full h-[372px] bg-muted flex items-center justify-center cursor-pointer group">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                <PlayCircle className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform z-10" />
              </div>
            </div>

            {/* Video Frame 2 - 872w fill 404h hug gap 8px */}
            <div className="flex flex-col flex-1 h-fit gap-[8px]">
              <h3 className="text-[#5A5A5A] font-sans font-semibold italic text-lg leading-[1.2]">
                Video 2 Title
              </h3>
              <div className="relative w-full h-[372px] bg-muted flex items-center justify-center cursor-pointer group">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                <PlayCircle className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform z-10" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
