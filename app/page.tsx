import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Award, ShieldCheck, Heart } from "lucide-react";
import { getProducts } from "@/lib/shopify";
import { ProductCardHorizontal } from "@/components/ProductCardHorizontal";
import { getCustomer } from "./lib/shopify";

export default async function Home() {
  const { body } = await getProducts();
  const products = body.data.products.edges.map((edge) => edge.node).slice(0, 3);

  const customer = await getCustomer();

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
        <div className="flex flex-row items-center justify-between w-[1920px] h-[790px] py-[120px] px-[100px] bg-transparent">
          {/* Redirection Frame */}
          <div className="flex flex-col w-[569px] h-[638px] gap-[48px] bg-transparent">
            {/* Text Content Frame */}
            <div className="flex flex-col w-full h-fit gap-[16px]">
              <div className="w-[409px] h-[64px]">
                <h1 className="text-[#FFFFFF] font-sans font-extrabold text-[32px] leading-[100%] tracking-[0%] uppercase">
                  MEJORA LA MOVILIDAD DE TU MASCOTA
                </h1>
              </div>
              <div className="w-[569px] h-[96px]">
                <p className="text-[#FFFFFF] font-sans font-medium text-[24px] leading-[100%] tracking-[0%] max-h-[72px]">
                  Productos ortpédicos especializados diseñados por veterinarios para el bienestar de tus mascotas.
                </p>
              </div>
              {/* Stats/Features Container */}
              <div className="flex flex-row w-[556px] h-fit gap-[16px]">
                {features.map((feature, index) => (
                  <div key={index} className="flex flex-col w-[122px] h-[118px] p-4 justify-center items-center gap-[12px] bg-white/10 rounded-lg backdrop-blur-sm transition-all hover:bg-white/20">
                    <feature.icon className="w-8 h-8 text-white shrink-0" />
                    <h3 className="text-white font-sans font-bold text-[11px] leading-tight text-center">
                      {feature.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Redirection Buttons Frame */}
            <div className="flex flex-row w-full h-[76px] gap-[16px]">
              {/* Button 1: Ver productos */}
              <Button asChild className="w-[262px] h-[76px] bg-[#8CC63F] hover:bg-[#7ab336] text-[#F5F5F5] rounded-[16px] px-[32px] py-[8px] flex items-center justify-center gap-[16px] border-none shadow-none">
                <Link href="/tienda">
                  <span className="font-sans font-semibold text-lg">Ver productos</span>
                  <ArrowRight className="w-[30px] h-[30px]" />
                </Link>
              </Button>

              {/* Button 2: Agenda una cita */}
              <Button asChild className="w-[291px] h-[76px] bg-transparent border-2 border-[#FFFFFF] hover:bg-white/10 text-white rounded-[16px] px-[32px] py-[8px] flex items-center justify-center gap-[16px] shadow-none">
                <Link href="/consultas">
                  <span className="font-sans font-semibold text-lg">Agenda una cita</span>
                  <Calendar className="w-[30px] h-[30px]" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 3D Model Frame */}
          <div className="flex flex-row w-[1080px] h-[700px] gap-[16px] bg-transparent">
            {/* 3D Image Frame */}
            <div className="flex flex-col w-[588px] h-[710px] gap-[16px] bg-transparent">
              {/* 3D Image Heading Text Frame */}
              <div className="flex flex-row items-center justify-center w-[542px] h-[64px] gap-[10px] mx-auto">
                <p className="text-[#F5F5F5] font-sans font-medium text-lg leading-[100%] text-center">
                  Haz clic en cualquier zona del cuerpo del perro para ver productos ortopédicos específicos para esa área.
                </p>
              </div>

              {/* 3D Image Mapper Frame */}
              <div className="relative w-[588px] h-[611px] rounded-[32px] overflow-hidden">
                <Image
                  src="/img/3dimgmapper.png"
                  alt="3D Dog Model Mapper"
                  fill
                  className="object-cover rounded-[32px]"
                />
              </div>
            </div>

            {/* 3D Products Frame */}
            <div className="flex flex-col w-[476px] h-[700px] pt-[28px] gap-[16px] bg-transparent">
              {/* 3D Products Subframe */}
              <div className="flex flex-col w-[476px] h-auto min-h-[614px] gap-[16px]">
                {/* Heading Text Frame */}
                <div className="flex flex-col w-[374px] h-[44px] gap-[8px] mx-auto">
                  <h2 className="text-[#F5F5F5] font-sans font-semibold text-[22px] leading-[100%] text-center uppercase">
                    Productos Recomendados para Cuello y Espalda
                  </h2>
                </div>

                {/* 3 Equal 3D Product Cards */}
                <div className="flex flex-col gap-[16px]">
                  {products.map((product) => (
                    <ProductCardHorizontal key={product.id} product={product} />
                  ))}
                  {/* Fill with placeholders if fewer than 3 products */}
                  {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="w-[476px] h-[148px] bg-white/10 rounded-[32px]"></div>
                  ))}
                </div>

                {/* 3D Redirection Frame */}
                <div className="flex flex-row items-center w-[278px] h-[63px] gap-[8px]">
                  <Link href="/tienda" className="flex items-center gap-[8px] text-[#F5F5F5] hover:opacity-80 transition-opacity">
                    <span className="font-sans font-medium text-lg leading-[100%] underline decoration-solid">
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
      <section className="bg-[#2B4A7C] text-white p-8 relative flex-grow">
        <div className="w-full">
          <div className="mb-12">
            <h2 className="font-sans font-extrabold text-white text-3xl mb-2 uppercase">Recursos y publicaciones</h2>
            <p className="text-[#DBEAFE] text-lg">Accede a casos de éxito, noticias, publicaciones y material descargable</p>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Leftmost Frame: 690px w (xl), 583px fixed h */}
            <div className="flex flex-col gap-6 w-full xl:flex-[690] h-[583px]">
              {/* Frame 1: Topmost */}
              <div className="flex flex-row gap-[34px] w-full xl:w-[688px] h-[247px] rounded-[16px] bg-white/20 pr-[36px] overflow-hidden">
                {/* Content for frame 1 */}
              </div>

              {/* Frame 2: Middle */}
              <div className="flex flex-row gap-[34px] w-full xl:w-[688px] h-[240px] rounded-[16px] bg-white/20 pl-[36px] overflow-hidden">
                {/* Content for frame 2 */}
              </div>

              {/* Frame 3: Bottommost */}
              <div className="w-full xl:w-[690px] h-[48px] bg-white/10 rounded-lg overflow-hidden">
                <Button className="w-full h-full bg-transparent hover:bg-white/10 text-white border-none shadow-none text-lg">
                  Ver más testimonios
                </Button>
              </div>
            </div>

            {/* Middle Frame: Proportional to 552px, 583px h */}
            <div className="flex flex-col gap-6 w-full xl:flex-[552] h-[583px]">
              {/* Topmost Frame: 548px w, 511px h, 16px radius, 20% transparency */}
              <div className="flex flex-col w-full xl:w-[548px] h-[511px] bg-white/20 rounded-[16px] overflow-hidden">
                {/* Content for middle top frame */}
              </div>

              {/* Bottommost Frame: 552px w, 48px h, 10% transparency */}
              <div className="w-full xl:w-[552px] h-[48px] bg-white/10 rounded-lg overflow-hidden">
                <Button className="w-full h-full bg-transparent hover:bg-white/10 text-white border-none shadow-none text-lg">
                  Ver más
                </Button>
              </div>
            </div>

            {/* Rightmost Image: Proportional to 472px, 583px h */}
            <div className="w-full xl:flex-[472] h-[583px] relative rounded-[16px] overflow-hidden">
              <Image
                src="/img/dummyproduct.png"
                alt="Dummy Product"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          {customer ? (
            <p>Logged in as {customer.email}</p>
          ) : (
            <p>Not logged in</p>
          )}

          <a href="https://shopify.com/97515667777/account/login?return_to=https%3A%2F%2Fdavidpaz.org" className="underline btn">
            Login
          </a>
        </div>
      </section>
    </>
  );
}
