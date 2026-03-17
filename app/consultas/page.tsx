"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function ConsultasPage() {
  return (
    <div className="flex flex-col w-full items-center bg-[#F5F1E6]">
      <section className="relative w-full max-w-[1920px] lg:pb-24 xl:pb-0 xl:h-[680px] lg:bg-[url('/img/consultas-icon.png')] bg-no-repeat bg-contain xl:[background-size:auto_85%] [background-position:calc(100%+120px)_100%] flex flex-col lg:flex-row lg:items-start">

        {/* Content Frame */}
        <div className="w-full lg:max-w-[540px] xl:max-w-[1114px] flex flex-col justify-center py-10 px-6 lg:py-[48px] lg:pl-[64px] xl:pl-[100px] gap-6 lg:gap-[48px] items-center lg:items-start">

          {/* Blur box */}
          <div className="flex flex-col gap-4 w-full items-center lg:items-start text-center lg:text-left bg-white/70 lg:bg-white/60 xl:bg-transparent p-4 md:p-6 xl:p-0 rounded-3xl xl:rounded-none backdrop-blur-md xl:backdrop-blur-none shadow-sm xl:shadow-none transition-all duration-300">
            <div className="flex flex-col xl:flex-row w-full">
              <div className="flex flex-col gap-3 xl:w-1/2">
                <h1 className="text-[#1E2939] font-sans font-extrabold leading-tight text-[clamp(1.25rem,3.5vw,3rem)]">
                  Agenda Tu Consulta Virtual
                </h1>
                <p className="text-[#757575] font-sans font-medium leading-snug text-[clamp(0.875rem,2vw,1.5rem)]">
                  Tu mascota merece atención profesional sin salir de casa. Ponte en contacto con nosotros para coordinar tu consulta virtual.
                </p>
              </div>
              <div className="hidden xl:block xl:w-1/2" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[#1E2939] font-sans font-bold text-[clamp(0.875rem,1.8vw,1.5rem)]">
                Recomendaciones:
              </h3>
              <ul className="flex flex-col gap-1.5 list-none p-0">
                <li className="text-[#757575] font-sans font-medium leading-relaxed text-[clamp(0.75rem,1.5vw,1.25rem)]">
                  Describe los síntomas con el mayor detalle posible.
                </li>
                <li className="text-[#757575] font-sans font-medium leading-relaxed text-[clamp(0.75rem,1.5vw,1.25rem)]">
                  Mantente pendiente de tu WhatsApp para la confirmación de tu cita.
                </li>
                <li className="text-[#757575] font-sans font-medium leading-relaxed text-[clamp(0.75rem,1.5vw,1.25rem)]">
                  Ten fotos o videos listos para compartir durante la consulta.
                </li>
              </ul>
            </div>
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/522282579865"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-sans font-bold text-lg md:text-xl xl:text-[clamp(1rem,1.8vw,1.5rem)] px-10 py-4 rounded-full hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20 border-none cursor-pointer group"
          >
            <Image
              src="/img/whatsapp_icon.svg"
              alt="WhatsApp"
              width={24}
              height={24}
              className="w-6 h-6 lg:w-8 lg:h-8"
            />
            Continuar en Whatsapp
            <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>

        {/* Mobile-only image — edge-to-edge */}
        <div className="lg:hidden relative w-full aspect-square overflow-hidden">
          <Image
            src="/img/consultas-icon.png"
            alt="Consulta veterinaria virtual"
            fill
            className="object-cover object-top"
          />
        </div>

        {/* Mobile dr.info */}
        <div className="lg:hidden w-full bg-[#FFFFFF99] px-[16px] py-[12px] flex flex-col gap-[10px] shadow-sm backdrop-blur-sm">
          <h2 className="text-[#1E2939] font-sans font-extrabold text-xl md:text-2xl leading-none text-center">
            Dra. Gabriela Mateos Trigos
          </h2>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-[#1E2939] font-sans font-medium text-sm md:text-base leading-tight">
              LICENCIATURA EN MEDICINA VETERINARIA Y ZOOTECNIA: 1458193
            </p>
            <p className="text-[#1E2939] font-sans font-medium text-sm md:text-base leading-tight">
              MAESTRÍA EN CIENCIAS FISIOLÓGICA: 2056201
            </p>
          </div>
        </div>

        {/* Dr.info — iPad + Desktop, absolute */}
        <div className="hidden lg:flex lg:absolute lg:right-[64px] lg:bottom-[48px] lg:w-[480px] xl:w-[560px] bg-[#FFFFFF99] px-[16px] py-[12px] flex-col gap-[10px] rounded-md shadow-sm backdrop-blur-sm">
          <h2 className="text-[#1E2939] font-sans font-extrabold text-[24px] leading-none">
            Dra. Gabriela Mateos Trigos
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-[#1E2939] font-sans font-medium text-[16px] leading-tight">
              LICENCIATURA EN MEDICINA VETERINARIA Y ZOOTECNIA: 1458193
            </p>
            <p className="text-[#1E2939] font-sans font-medium text-[16px] leading-tight">
              MAESTRÍA EN CIENCIAS FISIOLÓGICA: 2056201
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
