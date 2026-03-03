import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Award, ShieldCheck, Heart } from "lucide-react";
import { getProducts, getArticle } from "@/lib/shopify";
import { ProductCardHorizontal } from "@/components/ProductCardHorizontal";
import { AuthButton } from "@/components/AuthButton";
import { AccountPanel } from "@/components/AccountPanel";
import DogMap from "@/components/Perro3D";
import { NoticieroCarousel } from "@/components/ui/NoticieroCarousel";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { body } = await getProducts();
  const products = body.data.products.edges.map((edge) => edge.node).slice(0, 3);
  const landingArticle1 = await getArticle("noticias-landing-page", "noticia-landing-page-1", "no-store");
  const landingArticle2 = await getArticle("noticias-landing-page", "noticia-landing-page-2", "no-store");
  const landingArticle3 = await getArticle("noticias-landing-page", "recursos-landing-page", "no-store");


  console.log("--- Landing Articles Debug ---");
  console.log("Article 1:", landingArticle1 ? "Fetched" : "NULL");
  console.log("Article 2:", landingArticle2 ? "Fetched" : "NULL");
  if (landingArticle2) console.log("Article 2 Title:", landingArticle2.title);
  console.log("------------------------------");

  const carouselArticleHandles = [
    "carrusel-noticiero-1",
    "carrusel-noticiero-2",
    "carrusel-noticiero-3"
  ];
  const articlePromises = carouselArticleHandles.map(
    handle => getArticle("carrusel-noticiero",handle)
  );
  const carouselArticles = (await Promise.all(articlePromises)).filter(Boolean);

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
      {/* Landing Frame */}
      <div className="relative w-full bg-[linear-gradient(to_bottom,#294676,#4C83DC)] overflow-hidden flex justify-center">
        {/* sublanding frame */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1920px] min-h-[790px] py-12 lg:py-[120px] px-6 lg:px-[100px] gap-12 lg:gap-0 bg-transparent">
          {/* Redirection Frame */}
          <div className="flex flex-col w-full lg:w-[569px] gap-8 lg:gap-[48px] bg-transparent">
            {/* Text Content Frame */}
            <div className="flex flex-col w-full h-fit gap-4 lg:gap-[16px]">
              <div className="w-full lg:w-[409px]">
                <h1 className="text-[#FFFFFF] font-sans font-extrabold text-2xl md:text-3xl lg:text-[32px] leading-tight lg:leading-[100%] tracking-[0%] uppercase text-center lg:text-left">
                  MEJORA LA MOVILIDAD DE TU MASCOTA
                </h1>
              </div>
              <div className="w-full lg:w-[569px]">
                <p className="text-[#FFFFFF] font-sans font-medium text-lg md:text-xl lg:text-[24px] leading-snug lg:leading-[100%] tracking-[0%] text-center lg:text-left">
                  Productos ortpédicos especializados diseñados por veterinarios para el bienestar de tus mascotas.
                </p>
              </div>
              {/* Stats/Features Container */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row w-full lg:w-[556px] h-fit gap-4 lg:gap-[16px]">
                {features.map((feature, index) => (
                  <div key={index} className="flex flex-col flex-1 min-w-[110px] h-[118px] p-4 justify-center items-center gap-[12px] bg-white/10 rounded-lg backdrop-blur-sm transition-all hover:bg-white/20">
                    <feature.icon className="w-8 h-8 text-white shrink-0" />
                    <h3 className="text-white font-sans font-bold text-[11px] leading-tight text-center">
                      {feature.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Redirection Buttons Frame */}
            <div className="flex flex-col sm:flex-row w-full h-auto gap-4 lg:gap-[16px]">
              {/* Button 1: Ver productos */}
              <Button asChild className="w-full sm:w-[262px] h-[64px] lg:h-[76px] bg-[#8CC63F] hover:bg-[#7ab336] text-[#F5F5F5] rounded-[16px] px-[32px] py-[8px] flex items-center justify-center gap-[16px] border-none shadow-none">
                <Link href="/tienda">
                  <span className="font-sans font-semibold text-lg">Ver productos</span>
                  <ArrowRight className="w-[30px] h-[30px]" />
                </Link>
              </Button>

              {/* Button 2: Agenda una cita */}
              <Button asChild className="w-full sm:w-[291px] h-[64px] lg:h-[76px] bg-transparent border-2 border-[#FFFFFF] hover:bg-white/10 text-white rounded-[16px] px-[32px] py-[8px] flex items-center justify-center gap-[16px] shadow-none">
                <Link href="/consultas">
                  <span className="font-sans font-semibold text-lg">Agenda una cita</span>
                  <Calendar className="w-[30px] h-[30px]" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 3D Model Frame */}
          <div className="flex flex-col xl:flex-row w-full xl:w-[1080px] h-auto gap-8 lg:gap-[16px] bg-transparent">
            {/* 3D Image Frame */}
            <div className="flex flex-col w-full xl:w-[588px] gap-6 lg:gap-[16px] bg-transparent">
              {/* 3D Image Heading Text Frame */}
              <div className="flex flex-row items-center justify-center w-full lg:w-[542px] min-h-[64px] gap-[10px] mx-auto">
                <p className="text-[#F5F5F5] font-sans font-medium text-lg leading-tight text-center">
                  Haz clic en cualquier zona del cuerpo del perro para ver productos ortopédicos específicos para esa área.
                </p>
              </div>

              <div className="w-full flex justify-center">
                <DogMap />
              </div>
            </div>

            {/* 3D Products Frame */}
            <div className="flex flex-col w-full xl:w-[476px] h-auto xl:pt-[28px] gap-6 lg:gap-[16px] bg-transparent">
              {/* 3D Products Subframe */}
              <div className="flex flex-col w-full h-auto gap-6 lg:gap-[16px]">
                {/* Heading Text Frame */}
                <div className="flex flex-col w-full lg:w-[374px] gap-[8px] mx-auto">
                  <h2 className="text-[#F5F5F5] font-sans font-semibold text-xl lg:text-[22px] leading-tight text-center uppercase">
                    Productos Recomendados para Cuello y Espalda
                  </h2>
                </div>

                {/* 3 Equal 3D Product Cards */}
                <div className="flex flex-col gap-4 lg:gap-[16px]">
                  {products.map((product) => (
                    <ProductCardHorizontal key={product.id} product={product} />
                  ))}
                  {/* Fill with placeholders if fewer than 3 products */}
                  {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="w-full h-[148px] bg-white/10 rounded-[32px]"></div>
                  ))}
                </div>

                {/* 3D Redirection Frame */}
                <div className="flex flex-row items-center justify-center lg:justify-start w-full gap-[8px] mt-4 lg:mt-0">
                  <Link href="/tienda" className="flex items-center gap-[8px] text-[#F5F5F5] hover:opacity-80 transition-opacity">
                    <span className="font-sans font-medium text-lg leading-[100%] underline decoration-solid text-center lg:text-left">
                      Ver más productos recomendados
                    </span>
                    <ArrowRight className="w-[30px] h-[30px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                {/* Conditional Render del Articulo 1 */}
                {landingArticle1 && (
                  <div className="flex flex-col sm:flex-row w-full h-full">
                    {/* Imagen */}
                    {landingArticle1.image && (
                      <div className="w-full sm:w-[220px] h-[200px] sm:h-auto flex-shrink-0 relative">
                        <Image
                          src={landingArticle1.image.url}
                          alt={landingArticle1.image.altText || landingArticle1.title}
                          fill
                          className="object-cover"
                        />
                      </div>
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
                {/* Conditional Render del Articulo 2 */}
                {landingArticle2 && (
                  <div className="flex flex-col-reverse sm:flex-row w-full h-full">
                    <div className="flex flex-col flex-grow p-6 overflow-hidden">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{landingArticle2.title}</h3>
                      <div 
                        className="prose prose-invert prose-sm overflow-y-auto max-h-[120px] sm:max-h-none flex-grow pr-2"
                        dangerouslySetInnerHTML={{ __html: landingArticle2.contentHtml }}
                      />
                    </div>
                    {/* Imagen */}
                    {landingArticle2.image && (
                      <div className="w-full sm:w-[220px] h-[200px] sm:h-auto flex-shrink-0 relative">
                        <Image
                          src={landingArticle2.image.url}
                          alt={landingArticle2.image.altText || landingArticle2.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Frame 3: Bottommost */}
              <div className="w-full h-[48px] bg-white/10 rounded-lg overflow-hidden mt-auto">
                <Button className="w-full h-full bg-transparent hover:bg-white/10 text-white border-none shadow-none text-lg">
                  Ver más testimonios
                </Button>
              </div>
            </div>

            {/* Middle Frame: Proportional to 552px */}
            <div className="flex flex-col gap-6 w-full xl:flex-[552]">
              {/* Topmost Frame: Noticia Landing Page 3 */}
              <div className="flex flex-col w-full min-h-[511px] bg-white/20 rounded-[16px] overflow-hidden">
                {landingArticle3 && (
                  <>
                    {/* Image Frame */}
                    <div className="w-full aspect-video sm:aspect-auto sm:h-[310px] relative">
                      {landingArticle3.image && (
                        <Image
                          src={landingArticle3.image.url}
                          alt={landingArticle3.image.altText || landingArticle3.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    {/* Content Frame */}
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

              {/* Bottommost Frame */}
              <div className="w-full h-[48px] bg-white/10 rounded-lg overflow-hidden mt-auto">
                <Button className="w-full h-full bg-transparent hover:bg-white/10 text-white border-none shadow-none text-lg">
                  Ver más
                </Button>
              </div>
            </div>

            {/* Rightmost Image: Proportional to 472px */}
            <div className="w-full xl:flex-[472] aspect-video sm:aspect-[16/9] xl:aspect-auto xl:min-h-[583px]">
              {carouselArticles && carouselArticles.length>0 && (
                <NoticieroCarousel articles={carouselArticles}/>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
