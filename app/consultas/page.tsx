"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function ConsultasPage() {
  return (
    <div className="flex flex-col w-full items-center bg-[#F5F1E6] flex-grow">
      <section className="relative w-full max-w-[1920px] touch:flex-grow lg:bg-[url('/img/consultas-icon.png')] bg-no-repeat bg-contain xl:[background-size:auto_85%] [background-position:calc(100%+120px)_100%] flex flex-col lg:grid lg:grid-cols-[60%_40%] xl:grid-cols-[58%_42%] lg:grid-rows-[auto_auto]">

        {/* Left: spans both rows — blur box + button in same w-fit container */}
        <div className="lg:row-span-2 flex flex-col gap-4 mx-6 mt-10 mb-10 lg:mx-0 lg:mt-0 lg:mb-0 lg:pt-[48px] lg:pb-[48px] lg:pl-[64px] xl:pl-[100px] xl:pt-[48px] xl:pb-[48px] lg:w-fit xl:w-auto lg:gap-[16px] touch:!pt-8 touch:!pb-0 touch:!gap-6">

          {/* Blur box */}
          <div className="flex flex-col gap-4 lg:gap-3 items-center lg:items-start text-center lg:text-left bg-white/70 lg:bg-white/60 xl:bg-transparent touch:!bg-white/50 p-4 md:p-6 lg:px-5 lg:pt-6 lg:pb-6 xl:p-0 rounded-3xl xl:rounded-none backdrop-blur-md xl:backdrop-blur-none shadow-sm xl:shadow-none transition-all duration-300 w-full lg:w-0 lg:min-w-full xl:w-full xl:min-w-0 touch:!gap-10 touch:!p-14">
            <div className="flex flex-col w-full">
              <div className="flex flex-col gap-3 lg:gap-2 w-full touch:!gap-6">
                <h1 className="text-[#1E2939] font-sans font-extrabold leading-tight text-[clamp(0.95rem,2.6vw,2.25rem)] lg:text-[clamp(0.95rem,1.875vw,1.625rem)] xl:text-[clamp(0.55rem,2.6vw,2.25rem)] touch:!text-[2.25rem]">
                  Agenda Tu Consulta Virtual
                </h1>
                <p className="text-[#757575] font-sans font-medium leading-snug text-[clamp(0.65rem,1.5vw,1.1rem)] lg:text-[clamp(0.7rem,1.125vw,0.95rem)] xl:text-[clamp(0.375rem,1.5vw,1.1rem)] touch:!text-xl">
                  Tu mascota merece atención profesional sin salir de casa. Ponte en contacto con nosotros para coordinar tu consulta virtual.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:gap-2 touch:!gap-5">
              <h3 className="text-[#1E2939] font-sans font-bold text-[clamp(0.65rem,1.35vw,1.1rem)] lg:text-[clamp(0.7rem,1.03vw,0.85rem)] xl:text-[clamp(0.375rem,1.35vw,1.1rem)] touch:!text-xl">
                Recomendaciones:
              </h3>
              <ul className="flex flex-col gap-1.5 lg:gap-1.5 list-none p-0 touch:!gap-4">
                <li className="text-[#757575] font-sans font-medium leading-relaxed text-[clamp(0.55rem,1.1vw,0.95rem)] lg:text-[clamp(0.625rem,0.9375vw,0.8125rem)] xl:text-[clamp(0.3rem,1.1vw,0.95rem)] touch:!text-lg">
                  Describe los síntomas con el mayor detalle posible.
                </li>
                <li className="text-[#757575] font-sans font-medium leading-relaxed text-[clamp(0.55rem,1.1vw,0.95rem)] lg:text-[clamp(0.625rem,0.9375vw,0.8125rem)] xl:text-[clamp(0.3rem,1.1vw,0.95rem)] touch:!text-lg">
                  Mantente pendiente de tu WhatsApp para la confirmación de tu cita.
                </li>
                <li className="text-[#757575] font-sans font-medium leading-relaxed text-[clamp(0.55rem,1.1vw,0.95rem)] lg:text-[clamp(0.625rem,0.9375vw,0.8125rem)] xl:text-[clamp(0.3rem,1.1vw,0.95rem)] touch:!text-lg">
                  Ten fotos o videos listos para compartir durante la consulta.
                </li>
              </ul>
            </div>
          </div>

          {/* WhatsApp button */}
          <a
            href="https://wa.me/522282579865"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-sans font-bold text-lg md:text-xl xl:text-[clamp(1rem,1.8vw,1.5rem)] px-10 py-4 rounded-full hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20 border-none cursor-pointer group flex-shrink-0 xl:self-start"
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

        {/* Top-right: empty (background image shows through) */}
        <div className="hidden lg:block" />

        {/* Bottom-right: Cedula */}
        <div className="hidden lg:flex items-end justify-end pr-[4%] pb-[48px] pt-[16px]">
          <div className="bg-[#FFFFFF99] px-[16px] py-[12px] flex flex-col gap-[10px] rounded-md shadow-sm backdrop-blur-sm w-max shrink-0">
            <h2 className="text-[#1E2939] font-sans font-extrabold text-xl lg:text-[24px] leading-none">
              Dra. Gabriela Mateos Trigos
            </h2>
            <div className="flex flex-col gap-1">
              <p className="text-[#1E2939] font-sans font-medium text-sm lg:text-[16px] leading-tight">
                LICENCIATURA EN MEDICINA VETERINARIA Y ZOOTECNIA
              </p>
              <p className="text-[#1E2939] font-sans font-medium text-sm lg:text-[16px] leading-tight">
                MAESTRÍA EN CIENCIAS FISIOLÓGICA
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-only image */}
        <div className="lg:hidden relative w-full aspect-square overflow-hidden">
          <Image
            src="/img/consultas-icon.png"
            alt="Consulta veterinaria virtual"
            fill
            className="object-cover object-top"
          />
        </div>

      </section>
    </div>
  );
}
