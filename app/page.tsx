import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Landing Frame */}
      <div className="relative w-full bg-[linear-gradient(to_bottom,#294676,#4C83DC)] overflow-hidden flex justify-center">
        {/* sublanding frame */}
        <div className="flex flex-row items-center justify-between w-[1920px] h-[790px] py-[120px] px-[100px] bg-transparent">
          {/* Redirection Frame */}
          <div className="flex flex-col w-[569px] h-[638px] gap-[48px] bg-transparent">
            {/* Text Content Frame */}
            <div className="flex flex-col w-full h-[310px] gap-[16px]">
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
              <div className="flex flex-row w-[556px] h-[118px] gap-[16px]">
                <div className="flex flex-col w-[122px] h-[118px] gap-[8px] bg-white/10 rounded-lg"></div>
                <div className="flex flex-col w-[122px] h-[118px] gap-[8px] bg-white/10 rounded-lg"></div>
                <div className="flex flex-col w-[122px] h-[118px] gap-[8px] bg-white/10 rounded-lg"></div>
                <div className="flex flex-col w-[122px] h-[118px] gap-[8px] bg-white/10 rounded-lg"></div>
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

          {/* 3D Dog Frame */}
          <div className="flex flex-row w-[1080px] h-[700px] gap-[400px] bg-transparent">
            {/* 3D Dog content */}
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
      </section>
    </>
  );
}
