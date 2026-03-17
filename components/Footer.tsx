import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Link as LinkIcon, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E2939] text-white p-8 md:py-12 lg:py-16">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-x-20">
          {/* Left Block */}
          <div className="flex flex-col items-start min-w-[170px]">
            <Image src="/img/nav-logo.png" alt="Ortovets Logo" width={170} height={48} />
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              Si tiene alguna pregunta, por favor<br />
              <Link href="/contacto" className="underline hover:text-white transition-colors">
                contáctenos
              </Link>
              {" "}en: ortovets@gmail.com
            </p>
            <div className="flex flex-col gap-2 mt-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <span>Xalapa, Veracruz, Mexico</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                <span>(+52) 228 257 9865</span>
              </div>
            </div>
          </div>

          {/* Right Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-x-12 flex-grow">
            {/* List 1 */}
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-bold text-base mb-2">Legales</p>
              <Link href="/terminos" className="mt-2 inline-block hover:underline">Aviso de privacidad</Link>
              <Link href="/terminos" className="mt-2 inline-block hover:underline">Términos y condiciones</Link>
            </div>
            {/* List 2 */}
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-bold text-base mb-2">Servicios</p>
              <Link href="/consultas" className="mt-2 inline-block hover:underline">Consultas virtuales</Link>
              <Link href="/consultas" className="mt-2 inline-block hover:underline">Consultas presenciales</Link>
              <Link href="/tienda" className="mt-2 inline-block hover:underline">Productos ortopédicos</Link>
            </div>
            {/* Social Icons */}
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-bold text-base mb-2">Síguenos</p>
              <div className="flex space-x-5">
                <Facebook className="h-7 w-7 cursor-pointer hover:text-blue-400 transition-colors" />
                <LinkIcon className="h-7 w-7 cursor-pointer hover:text-blue-400 transition-colors" />
                <Instagram className="h-7 w-7 cursor-pointer hover:text-pink-400 transition-colors" />
                <Youtube className="h-7 w-7 cursor-pointer hover:text-red-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Ortovets</p>
        </div>
      </div>
    </footer>
  );
}
