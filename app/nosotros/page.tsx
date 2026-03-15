import { Heart, Zap, PawPrint, Star } from "lucide-react";

export default function Nosotros() {
  return (
    <div className="flex flex-col w-full items-center bg-white space-y-8 md:space-y-10 lg:space-y-12 xl:space-y-14 py-8 md:py-10 lg:py-12">
      {/* Frame 1: Hero Section */}
      <section className="relative w-full max-w-[1920px] min-h-[300px] md:min-h-[380px] lg:min-h-[440px] xl:h-[478px] flex items-center justify-center bg-[#F5F1E3CC] bg-cover bg-center py-12 md:py-14 lg:py-16 xl:py-0">
        <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
        <div className="relative w-full max-w-[1054px] px-6 flex flex-col items-center justify-center text-center gap-4 md:gap-5 lg:gap-6 xl:gap-1">
          <h1 className="text-[#1E2939] font-sans font-extrabold text-3xl md:text-4xl lg:text-5xl xl:text-[48px] leading-tight xl:leading-[1.0]">
            ¿Quiénes Somos?
          </h1>
          <p className="text-[#1E2939] font-sans font-medium text-base md:text-lg lg:text-xl xl:text-[24px] leading-relaxed xl:leading-[1.4] max-w-3xl">
            Expertos en soluciones ortopédicas para mascotas. Somos una empresa mexicana dedicada al diseño y fabricación de productos ortopédicos para animales de compañía. Contamos con el respaldo y la supervisión directa de especialistas en terapia física y rehabilitación veterinaria.
          </p>
        </div>
      </section>

      {/* Frame 2: Nuestros Valores */}
      <section className="relative w-full max-w-[1920px] min-h-fit lg:aspect-[1920/1080] xl:aspect-[4096/2451] flex items-center justify-center md:justify-end py-12 md:py-14 lg:py-16 xl:py-0 px-6 md:px-12 lg:px-16 xl:px-[120px] bg-[#F7F2E8] overflow-hidden">
        {/* Background Image Layer - Occupies left half, arbitrary position slides the window slightly back left */}
        <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-[url('/img/nosotros-frame1-bgimg.png')] bg-cover bg-[15%_center] pointer-events-none" />
        
        {/* Content Layer - Blur triggers when text spills over to the left half (approx. < 1440px) */}
        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-7 lg:gap-8 w-full max-w-[600px] bg-white/70 md:bg-white/50 xl:bg-white/30 2xl:bg-transparent p-6 md:p-8 lg:p-10 xl:p-8 2xl:p-0 rounded-3xl md:rounded-2xl backdrop-blur-md xl:backdrop-blur-sm 2xl:backdrop-blur-none shadow-sm md:shadow-none transition-all duration-300">
          <h2 className="text-[#1E2939] font-sans font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-[40px] leading-tight text-center w-full">
            Nuestros Valores
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-x-6 lg:gap-x-8 md:gap-y-8 lg:gap-y-10 w-full">
            {/* Bienestar Primero */}
            <div className="flex flex-col items-center text-center gap-3 lg:gap-4">
              <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] lg:w-[70px] lg:h-[70px] rounded-full bg-[#8CC63F] flex items-center justify-center shrink-0 shadow-md">
                <Heart className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className="text-[#1E2939] font-semibold text-lg md:text-xl xl:text-[20px] leading-tight">
                  Bienestar Primero
                </h3>
                <p className="text-[#1E2939]/90 font-sans font-normal text-xs md:text-sm lg:text-[13px] xl:text-sm leading-relaxed">
                  Cada decisión que tomamos está orientada a mejorar la calidad de vida de las mascotas, priorizando su comodidad, movilidad y salud integral.
                </p>
              </div>
            </div>

            {/* Innovación Con Propósito */}
            <div className="flex flex-col items-center text-center gap-3 lg:gap-4">
              <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] lg:w-[70px] lg:h-[70px] rounded-full bg-[#8CC63F] flex items-center justify-center shrink-0 shadow-md">
                <Zap className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className="text-[#1E2939] font-semibold text-lg md:text-xl xl:text-[20px] leading-tight">
                  Innovación Con Propósito
                </h3>
                <p className="text-[#1E2939]/90 font-sans font-normal text-xs md:text-sm lg:text-[13px] xl:text-sm leading-relaxed">
                  Desarrollamos soluciones ortopédicas basadas en investigación, tecnología y mejora continua para ofrecer productos realmente funcionales and efectivos.
                </p>
              </div>
            </div>

            {/* Atención Personalizada */}
            <div className="flex flex-col items-center text-center gap-3 lg:gap-4">
              <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] lg:w-[70px] lg:h-[70px] rounded-full bg-[#8CC63F] flex items-center justify-center shrink-0 shadow-md">
                <PawPrint className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className="text-[#1E2939] font-semibold text-lg md:text-xl xl:text-[20px] leading-tight">
                  Atención Personalizada
                </h3>
                <p className="text-[#1E2939]/90 font-sans font-normal text-xs md:text-sm lg:text-[13px] xl:text-sm leading-relaxed">
                  Reconocemos que cada mascota es única. Escuchamos, entendemos y diseñamos soluciones adaptadas a necesidades específicas.
                </p>
              </div>
            </div>

            {/* Calidad y Confianza */}
            <div className="flex flex-col items-center text-center gap-3 lg:gap-4">
              <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] lg:w-[70px] lg:h-[70px] rounded-full bg-[#8CC63F] flex items-center justify-center shrink-0 shadow-md">
                <Star className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-1 lg:gap-2">
                <h3 className="text-[#1E2939] font-semibold text-lg md:text-xl xl:text-[20px] leading-tight">
                  Calidad y Confianza
                </h3>
                <p className="text-[#1E2939]/90 font-sans font-normal text-xs md:text-sm lg:text-[13px] xl:text-sm leading-relaxed">
                  Trabajamos bajo altos estándares de fabricación, utilizando materiales seguros y duraderos que garantizan respaldo, seguridad y tranquilidad para sus familias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frame 3: Misión y Visión */}
      <section className="w-full max-w-[1920px] min-h-fit md:min-h-[500px] lg:min-h-[547px] bg-[#F5EEE5] bg-[url('/img/nosotros-frame2-bg.png')] bg-no-repeat bg-center md:bg-right bg-cover md:bg-contain flex items-center py-12 md:py-14 lg:py-16 px-6 md:px-12 lg:px-16 xl:px-[64px]">
        <div className="w-full max-w-[1187px] flex flex-col gap-8 md:gap-9 lg:gap-10 xl:gap-[42px] bg-white/70 md:bg-white/40 lg:bg-white/20 xl:bg-transparent p-6 md:p-8 lg:p-10 xl:p-0 rounded-3xl md:rounded-2xl backdrop-blur-sm xl:backdrop-blur-none shadow-sm md:shadow-none">
          <div className="flex flex-col gap-3 md:gap-2 lg:gap-4">
            <h2 className="text-[#8CC63F] font-sans font-extrabold text-3xl md:text-4xl lg:text-5xl xl:text-[48px] leading-tight xl:leading-[1.0] uppercase">
              Visión
            </h2>
            <p className="text-[#294676] font-sans font-medium text-base md:text-lg lg:text-xl xl:text-[24px] leading-relaxed xl:leading-[1.4] max-w-2xl">
              Brindar soluciones ortopédicas especializadas de alta calidad que mejoren la movilidad, el bienestar and la calidad de vida de las mascotas, a través de innovación, atención personalizada y estándares médicos rigurosos.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:gap-2 lg:gap-4">
            <h2 className="text-[#8CC63F] font-sans font-extrabold text-3xl md:text-4xl lg:text-5xl xl:text-[48px] leading-tight xl:leading-[1.0] uppercase">
              Misión
            </h2>
            <p className="text-[#294676] font-sans font-medium text-lg md:text-xl lg:text-[24px] leading-relaxed xl:leading-[1.4] max-w-2xl">
              Ser la marca referente en soluciones ortopédicas veterinarias en Latinoamérica, reconocida por nuestra innovación, compromiso con el bienestar animal y excelencia en cada producto que desarrollamos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
