import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Award, ShieldCheck, Heart } from "lucide-react";
import { getProducts, getArticleByTag, getArticlesByTag } from "@/lib/shopify";
import { ProductCardHorizontal } from "@/components/ProductCardHorizontal";
import { AuthButton } from "@/components/AuthButton";
import { AccountPanel } from "@/components/AccountPanel";
import { DogMapWithProducts } from "@/components/DogMapWithProducts";
import { BreakpointLogger } from "@/components/BreakpointLogger";
import { NoticieroCarousel } from "@/components/ui/NoticieroCarousel";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { body } = await getProducts();
  const products = body.data.products.edges.map((edge) => edge.node).slice(0, 3);

  const LANDING_TAGS = {
    article1: "noticia-landing-page-1",
    article2: "noticia-landing-page-2",
    article3: "recursos-landing-page",
    carousel: "carrusel-noticiero",
  };

  const [landingArticle1, landingArticle2, landingArticle3, carouselArticles] = await Promise.all([
    getArticleByTag(LANDING_TAGS.article1, "no-store"),
    getArticleByTag(LANDING_TAGS.article2, "no-store"),
    getArticleByTag(LANDING_TAGS.article3, "no-store"),
    getArticlesByTag(LANDING_TAGS.carousel),
  ]);

  const features = [
    {
      icon: Clock,
      title: "Asesoría Especializada",
    },
    {
      icon: Award,
      title: "Calidad Garantizada",
    },
    {
      icon: ShieldCheck,
      title: "Compras Protegidas",
    },
    {
      icon: Heart,
      title: "Marca 100% Mexicana",
    },
  ];

  return (
    <>
      <BreakpointLogger />
      {/* Landing Frame */}
      <div className="relative bg-[linear-gradient(to_bottom,#294676,#4C83DC)] min-h-[calc(100vh-64px)] flex justify-center">
        <DogMapWithProducts defaultProducts={products} />
      </div>

      {/* Main Section: Recursos y Publicaciones */}
      <section className="bg-[#2B4A7C] text-white p-6 md:p-8 lg:p-12 relative flex-grow">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="font-sans font-extrabold text-white text-2xl md:text-3xl mb-2 uppercase">Recursos y publicaciones</h2>
            <p className="text-[#DBEAFE] text-base md:text-lg">Accede a casos de éxito, noticias, publicaciones y material descargable</p>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Leftmost Frame: Proportional to 690px */}
            <div className="flex flex-col gap-6 w-full xl:flex-[690]">
              {/* #1. Topmost Frame: Noticia Landing Page 1 */}
              <div className="w-full min-h-[247px] rounded-[16px] bg-white/20 overflow-hidden">
                {landingArticle1 && (
                  <div className="flex flex-col sm:flex-row w-full h-full">
                    {landingArticle1.image && (
                      <Link href={`/noticias/${landingArticle1.blogHandle}/${landingArticle1.handle}`} className="w-full sm:w-[220px] h-[200px] sm:h-auto flex-shrink-0 relative block">
                        <Image
                          src={landingArticle1.image.url}
                          alt={landingArticle1.image.altText || landingArticle1.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    )}
                    <div className="flex flex-col flex-grow p-6 overflow-hidden">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{landingArticle1.title}</h3>
                      <div
                        className="prose prose-invert prose-sm overflow-y-auto max-h-[120px] sm:max-h-none flex-grow pr-2"
                        dangerouslySetInnerHTML={{ __html: landingArticle1.contentHtml }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* #2. Middle Frame - Noticia Landing Page 2 */}
              <div className="w-full min-h-[240px] rounded-[16px] bg-white/20 overflow-hidden">
                {landingArticle2 && (
                  <div className="flex flex-col-reverse sm:flex-row w-full h-full">
                    <div className="flex flex-col flex-grow p-6 overflow-hidden">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{landingArticle2.title}</h3>
                      <div
                        className="prose prose-invert prose-sm overflow-y-auto max-h-[120px] sm:max-h-none flex-grow pr-2"
                        dangerouslySetInnerHTML={{ __html: landingArticle2.contentHtml }}
                      />
                    </div>
                    {landingArticle2.image && (
                      <Link href={`/noticias/${landingArticle2.blogHandle}/${landingArticle2.handle}`} className="w-full sm:w-[220px] h-[200px] sm:h-auto flex-shrink-0 relative block">
                        <Image
                          src={landingArticle2.image.url}
                          alt={landingArticle2.image.altText || landingArticle2.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Frame 3: Bottommost */}
              <div className="w-full h-[48px] bg-white/10 rounded-lg overflow-hidden mt-auto">
                <Button asChild className="w-full h-full bg-transparent hover:bg-white/10 text-white border-none shadow-none text-lg">
                  <Link href="/noticias?blog=historias-de-exito">Ver más testimonios</Link>
                </Button>
              </div>
            </div>

            {/* Middle Frame: Proportional to 552px */}
            <div className="flex flex-col gap-6 w-full xl:flex-[552]">
              <div className="flex flex-col w-full min-h-[511px] bg-white/20 rounded-[16px] overflow-hidden">
                {landingArticle3 && (
                  <>
                    <Link href={`/noticias/${landingArticle3.blogHandle}/${landingArticle3.handle}`} className="w-full aspect-video sm:aspect-auto sm:h-[310px] relative block">
                      {landingArticle3.image && (
                        <Image
                          src={landingArticle3.image.url}
                          alt={landingArticle3.image.altText || landingArticle3.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex flex-col w-full p-6 gap-4 overflow-hidden">
                      <h3 className="text-xl font-bold line-clamp-2">{landingArticle3.title}</h3>
                      <div
                        className="prose prose-invert prose-sm line-clamp-4 lg:line-clamp-6"
                        dangerouslySetInnerHTML={{ __html: landingArticle3.contentHtml }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="w-full h-[48px] bg-white/10 rounded-lg overflow-hidden mt-auto">
                <Button asChild className="w-full h-full bg-transparent hover:bg-white/10 text-white border-none shadow-none text-lg">
                  <Link href="/noticias?blog=material-descargable">Ver más</Link>
                </Button>
              </div>
            </div>

            {/* Rightmost Image: Proportional to 472px */}
            <div className="w-full xl:flex-[472] aspect-video sm:aspect-[16/9] xl:aspect-auto xl:min-h-[583px]">
              {carouselArticles && carouselArticles.length > 0 && (
                <NoticieroCarousel articles={carouselArticles} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
