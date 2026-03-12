"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function ConsultasPage() {
  return (
    <div className="flex flex-col w-full items-center bg-[#F5F1E6]">
      <section className="relative w-full max-w-[1920px] min-h-[600px] lg:h-[540px] bg-[url('/img/consultas-icon.png')] bg-no-repeat bg-right-bottom bg-contain flex flex-col lg:flex-row items-center">
        
        {/* Content Frame */}
        <div className="w-full max-w-[1114px] flex flex-col justify-center py-12 md:py-16 lg:py-[48px] px-6 lg:pl-[100px] gap-8 md:gap-10 lg:gap-[48px] items-center lg:items-start">
          
          {/* Main Block (Centered on mobile/tablet, left-aligned on desktop/ipad pro) */}
          <div className="flex flex-col gap-8 w-full max-w-[800px] items-center lg:items-start text-center lg:text-left bg-white/70 md:bg-white/50 xl:bg-white/30 2xl:bg-transparent p-6 md:p-10 xl:p-8 2xl:p-0 rounded-3xl md:rounded-2xl backdrop-blur-md xl:backdrop-blur-sm 2xl:backdrop-blur-none shadow-sm md:shadow-none transition-all duration-300">
            
            {/* Title and Subtitle Container */}
            <div className="flex flex-col gap-4">
              <h1 className="text-[#1E2939] font-sans font-extrabold text-3xl md:text-4xl lg:text-[48px] leading-tight">
                Agenda Tu Consulta Virtual
              </h1>
              <p className="text-[#757575] font-sans font-medium text-lg md:text-xl lg:text-[24px] leading-snug lg:leading-[1.2]">
                Tu mascota merece atención profesional sin salir de casa. Ponte en contacto con nosotros para coordinar tu consulta virtual.
              </p>
            </div>

            {/* Recommendations Container */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h3 className="text-[#1E2939] font-sans font-bold text-xl md:text-2xl lg:text-[24px]">
                Recomendaciones:
              </h3>
              <ul className="flex flex-col gap-2 list-none p-0">
                <li className="text-[#757575] font-sans font-medium text-base md:text-lg lg:text-[20px] leading-relaxed">
                  Describe los síntomas con el mayor detalle posible.
                </li>
                <li className="text-[#757575] font-sans font-medium text-base md:text-lg lg:text-[20px] leading-relaxed">
                  Mantente pendiente de tu WhatsApp para la confirmación de tu cita.
                </li>
                <li className="text-[#757575] font-sans font-medium text-base md:text-lg lg:text-[20px] leading-relaxed">
                  Ten fotos o videos listos para compartir durante la consulta.
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <a 
              href="https://wa.me/522282579865" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-sans font-bold text-lg md:text-xl lg:text-[24px] px-10 py-4 rounded-full hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20 border-none cursor-pointer group"
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
        </div>

        {/* Dra. Info Frame */}
        <div className="relative lg:absolute lg:right-[64px] lg:bottom-[48px] w-full lg:w-[560px] h-auto bg-[#FFFFFF99] px-[16px] py-[12px] flex flex-col gap-[10px] lg:rounded-md shadow-sm backdrop-blur-sm mt-8 lg:mt-0">
          <h2 className="text-[#1E2939] font-sans font-extrabold text-xl md:text-2xl lg:text-[24px] leading-none text-center lg:text-left">
            Dra. Gabriela Mateos Trigos
          </h2>
          <div className="flex flex-col gap-1 text-center lg:text-left">
            <p className="text-[#1E2939] font-sans font-medium text-sm md:text-base lg:text-[16px] leading-tight">
              LICENCIATURA EN MEDICINA VETERINARIA Y ZOOTECNIA: 1458193
            </p>
            <p className="text-[#1E2939] font-sans font-medium text-sm md:text-base lg:text-[16px] leading-tight">
              MAESTRÍA EN CIENCIAS FISIOLÓGICA: 2056201
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
