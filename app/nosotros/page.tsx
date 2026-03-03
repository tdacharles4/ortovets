import { Heart, Zap, PawPrint, Star } from "lucide-react";

export default function Nosotros() {
  return (
    <div className="flex flex-col w-full items-center">
      {/* Frame 1: Hero Section */}
      <section className="relative w-full max-w-[1920px] min-h-[400px] md:h-[478px] flex items-center justify-center bg-[url('/img/nosotros-frame1-bg.png')] bg-cover bg-center py-12 md:py-0">
        <div className="absolute inset-0 bg-black/20 md:bg-transparent" />
        <div className="relative w-full max-w-[1054px] px-6 flex flex-col items-center justify-center text-center gap-4 md:gap-1">
          <h1 className="text-[#FFFFFF] font-sans font-extrabold text-3xl md:text-5xl lg:text-[48px] leading-tight md:leading-[1.0]">
            ¿Quiénes Somos?
          </h1>
          <p className="text-[#FFFFFF] font-sans font-medium text-lg md:text-xl leading-[1.4] max-w-3xl">
            Expertos en soluciones ortopédicas para mascotas. Somos una empresa mexicana dedicada al diseño y fabricación de productos ortopédicos para animales de compañía. Contamos con el respaldo y la supervisión directa de especialistas en terapia física y rehabilitación veterinaria.
          </p>
        </div>
      </section>

      {/* Frame 2: Misión y Visión */}
      <section className="w-full max-w-[1920px] min-h-[547px] bg-[#F5F1E7] bg-[url('/img/nosotros-frame2-bg.png')] bg-no-repeat bg-right-bottom md:bg-right bg-contain flex items-center py-12 px-6 md:px-16 lg:px-[64px]">
        <div className="w-full max-w-[1187px] flex flex-col gap-10 md:gap-[42px] bg-[#F5F1E7]/80 md:bg-transparent p-6 md:p-0 rounded-2xl">
          <div className="flex flex-col gap-3 md:gap-2">
            <h2 className="text-[#8CC63F] font-sans font-extrabold text-3xl md:text-5xl lg:text-[48px] leading-tight md:leading-[1.0] uppercase">
              Misión
            </h2>
            <p className="text-[#294676] font-sans font-medium text-lg md:text-xl leading-[1.4] max-w-2xl">
              Ser la marca referente en soluciones ortopédicas veterinarias en Latinoamérica, reconocida por nuestra innovación, compromiso con el bienestar animal y excelencia en cada producto que desarrollamos.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:gap-2">
            <h2 className="text-[#8CC63F] font-sans font-extrabold text-3xl md:text-5xl lg:text-[48px] leading-tight md:leading-[1.0] uppercase">
              Visión
            </h2>
            <p className="text-[#294676] font-sans font-medium text-lg md:text-xl leading-[1.4] max-w-2xl">
              Brindar soluciones ortopédicas especializadas de alta calidad que mejoren la movilidad, el bienestar y la calidad de vida de las mascotas, a través de innovación, atención personalizada y estándares médicos rigurosos.
            </p>
          </div>
        </div>
      </section>

      {/* Frame 3: Nuestros Valores */}
      <section className="w-full max-w-[1920px] min-h-[547px] bg-gradient-to-b from-[#132D59] to-[#317BE5] flex flex-col items-center justify-center py-16 px-6 gap-12">
        <h2 className="text-[#FFFFFF] font-sans font-extrabold text-3xl md:text-5xl lg:text-[48px] leading-tight text-center">
          Nuestros Valores
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 w-full max-w-[1400px]">
          {/* Bienestar Primero */}
          <div className="flex flex-col items-center text-center gap-4 p-4">
            <Heart className="w-16 h-16 md:w-20 md:h-20 text-white fill-white" />
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold text-xl md:text-2xl lg:text-[25px] leading-tight">
                Bienestar Primero
              </h3>
              <p className="text-white/90 font-sans font-normal text-sm md:text-base leading-relaxed">
                Cada decisión que tomamos está orientada a mejorar la calidad de vida de las mascotas, priorizando su comodidad, movilidad y salud integral.
              </p>
            </div>
          </div>

          {/* Innovación Con Propósito */}
          <div className="flex flex-col items-center text-center gap-4 p-4">
            <Zap className="w-16 h-16 md:w-20 md:h-20 text-white fill-white" />
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold text-xl md:text-2xl lg:text-[25px] leading-tight">
                Innovación Con Propósito
              </h3>
              <p className="text-white/90 font-sans font-normal text-sm md:text-base leading-relaxed">
                Desarrollamos soluciones ortopédicas basadas en investigación, tecnología y mejora continua para ofrecer productos realmente funcionales y efectivos.
              </p>
            </div>
          </div>

          {/* Atención Personalizada */}
          <div className="flex flex-col items-center text-center gap-4 p-4">
            <PawPrint className="w-16 h-16 md:w-20 md:h-20 text-white fill-white" />
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold text-xl md:text-2xl lg:text-[25px] leading-tight">
                Atención Personalizada
              </h3>
              <p className="text-white/90 font-sans font-normal text-sm md:text-base leading-relaxed">
                Reconocemos que cada mascota es única. Escuchamos, entendemos y diseñamos soluciones adaptadas a necesidades específicas.
              </p>
            </div>
          </div>

          {/* Calidad y Confianza */}
          <div className="flex flex-col items-center text-center gap-4 p-4">
            <Star className="w-16 h-16 md:w-20 md:h-20 text-white fill-white" />
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold text-xl md:text-2xl lg:text-[25px] leading-tight">
                Calidad y Confianza
              </h3>
              <p className="text-white/90 font-sans font-normal text-sm md:text-base leading-relaxed">
                Trabajamos bajo altos estándares de fabricación, utilizando materiales seguros y duraderos que garantizan respaldo, seguridad y tranquilidad para sus familias.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
