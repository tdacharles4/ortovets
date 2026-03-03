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
      {/* Header Frame */}
      <header className="w-full h-[68px] py-4 px-4 md:px-8 lg:px-16 flex items-center gap-[10px]">
        {/* Button: Todos los productos */}
        <Link 
          href="/tienda"
          className="flex items-center gap-[8px] bg-transparent border-none p-0 transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="w-5 h-5 text-[#14AE5C]" />
          <span className="font-sans font-semibold text-base md:text-lg leading-[1.4] text-[#14AE5C]">
            Todos los productos
          </span>
        </Link>
      </header>

      {/* Product Page Frame */}
      <main className="w-full max-w-[1920px] mx-auto overflow-x-hidden flex flex-col gap-6">
        {/* PP Content Frame */}
        <div className="w-full px-4 md:px-8 lg:px-16">
          <ProductPageContent product={product} />
        </div>

        {/* Reviews Grid Frame */}
        <section className="w-full h-auto py-8 md:py-12 px-4 md:px-8 lg:px-16 flex flex-col gap-6 bg-white mt-8 md:mt-12">
          {/* Text Heading: Reseñas más recientes */}
          <h2 className="text-[#1E1E1E] font-sans font-semibold text-2xl leading-[1.2]">
            Reseñas más recientes
          </h2>
          
          {/* Reviews Frame - Horizontal scroll on mobile, grid on desktop if needed, for now keeping horizontal list with better spacing */}
          <div className="flex flex-row gap-6 md:gap-8 w-full mt-4 overflow-x-auto pb-4 scrollbar-hide">
            <div className="min-w-[280px] sm:min-w-[320px] lg:flex-1">
              <ReviewCard />
            </div>
            <div className="min-w-[280px] sm:min-w-[320px] lg:flex-1">
              <ReviewCard />
            </div>
            <div className="min-w-[280px] sm:min-w-[320px] lg:flex-1">
              <ReviewCard />
            </div>
          </div>
        </section>

        {/* Videos Recomendados Frame */}
        <section className="w-full h-auto py-8 md:py-12 px-4 md:px-8 lg:px-16 flex flex-col gap-8 bg-white opacity-90 mt-8 md:mt-12 mb-12 md:mb-20">
          {/* Text Heading: Videos Recomendados */}
          <h2 className="text-[#1E1E1E] font-sans font-semibold text-2xl leading-[1.2]">
            Videos Recomendados
          </h2>

          {/* Videos Content Frame */}
          <div className="flex flex-col md:flex-row w-full gap-8 md:gap-12 lg:gap-[48px]">
            {/* Video Frame 1 */}
            <div className="flex flex-col flex-1 gap-3">
              <h3 className="text-[#5A5A5A] font-sans font-semibold italic text-lg leading-[1.2]">
                Video 1 Title
              </h3>
              <div className="relative w-full aspect-video md:h-[300px] lg:h-[372px] bg-muted flex items-center justify-center cursor-pointer group rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                <PlayCircle className="w-12 h-12 lg:w-16 lg:h-16 text-white/80 group-hover:scale-110 transition-transform z-10" />
              </div>
            </div>

            {/* Video Frame 2 */}
            <div className="flex flex-col flex-1 gap-3">
              <h3 className="text-[#5A5A5A] font-sans font-semibold italic text-lg leading-[1.2]">
                Video 2 Title
              </h3>
              <div className="relative w-full aspect-video md:h-[300px] lg:h-[372px] bg-muted flex items-center justify-center cursor-pointer group rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                <PlayCircle className="w-12 h-12 lg:w-16 lg:h-16 text-white/80 group-hover:scale-110 transition-transform z-10" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
