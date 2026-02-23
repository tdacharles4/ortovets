export default function Nosotros() {
  return (
    <div className="flex flex-col w-full items-center">
      {/* Frame 1 */}
      <section className="relative w-full max-w-[1920px] h-[478px] flex items-center justify-center bg-[url('/img/nosotros-frame1-bg.png')] bg-cover bg-center">
        <div className="w-[1054px] h-[160px] flex flex-col items-center justify-center text-center gap-1">
          <h1 className="text-[#FFFFFF] font-sans font-extrabold text-[48px] leading-[1.0]">
            ¿Quiénes Somos?
          </h1>
          <p className="text-[#FFFFFF] font-sans font-medium text-xl leading-[1.4]">
            Expertos en soluciones ortopédicas para mascotas. Somos una empresa mexicana dedicada al diseño y fabricación de productos ortopédicos para animales de compañía. Contamos con el respaldo y la supervisión directa de especialistas en terapia física y rehabilitación veterinaria.
          </p>
        </div>
      </section>

      {/* Frame 2 */}
      <section className="w-full max-w-[1920px] h-[547px] bg-[#F5F1E7] bg-[url('/img/nosotros-frame2-bg.png')] bg-no-repeat bg-right bg-contain flex items-center px-[64px]">
        <div className="w-[1187px] flex flex-col gap-[42px]">
          <div className="flex flex-col gap-2">
            <h2 className="text-[#8CC63F] font-sans font-extrabold text-[48px] leading-[1.0] uppercase">
              Misión
            </h2>
            <p className="text-[#294676] font-sans font-medium text-xl leading-[1.4]">
              Ser la marca referente en soluciones ortopédicas veterinarias en Latinoamérica, reconocida por nuestra innovación, compromiso con el bienestar animal y excelencia en cada producto que desarrollamos.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[#8CC63F] font-sans font-extrabold text-[48px] leading-[1.0] uppercase">
              Visión
            </h2>
            <p className="text-[#294676] font-sans font-medium text-xl leading-[1.4]">
              Brindar soluciones ortopédicas especializadas de alta calidad que mejoren la movilidad, el bienestar y la calidad de vida de las mascotas, a través de innovación, atención personalizada y estándares médicos rigurosos.
            </p>
          </div>
        </div>
      </section>

      {/* Frame 3 */}
      <section className="w-full max-w-[1920px] h-[547px] bg-gradient-to-b from-[#132D59] to-[#317BE5] flex flex-col items-center justify-center gap-8">

      </section>
    </div>
  );
}
