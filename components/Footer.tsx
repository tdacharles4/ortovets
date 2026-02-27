import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Link as LinkIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E2939] text-white p-8 md:py-12 lg:py-16">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-x-20">
          {/* Left Block */}
          <div className="flex flex-col items-start min-w-[170px]">
            <Image src="/img/nav-logo.png" alt="Ortovets Logo" width={170} height={48} />
            <div className="flex space-x-6 mt-6">
              <Facebook className="h-7 w-7 cursor-pointer hover:text-blue-400 transition-colors" />
              <LinkIcon className="h-7 w-7 cursor-pointer hover:text-blue-400 transition-colors" />
              <Instagram className="h-7 w-7 cursor-pointer hover:text-pink-400 transition-colors" />
              <Youtube className="h-7 w-7 cursor-pointer hover:text-red-500 transition-colors" />
            </div>
          </div>

          {/* Right Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-x-12 flex-grow">
            {/* List 1 */}
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-bold text-base mb-2">About</p>
              <p className="text-gray-300">I met a traveller from an antique land</p>
              <p className="text-gray-300">Who said—“Two vast and trunkless legs of stone</p>
              <p className="text-gray-300">Stand in the desert. . . . Near them, on the sand,</p>
              <p className="text-gray-300">Half sunk, a shattered visage lies</p>
            </div>
            {/* List 2 */}
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-bold text-base mb-2">Explore</p>
              <p className="text-gray-300">whose frown, And wrinkled lip, and sneer of cold command,</p>
              <p className="text-gray-300">Tell that its sculptor well those passions read</p>
              <p className="text-gray-300">Which yet survive, stamped on these lifeless things,</p>
              <p className="text-gray-300">The hand that mocked them, and the heart that fed;</p>
            </div>
            {/* List 3 */}
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-bold text-base mb-2">Legacy</p>
              <p className="text-gray-300">And on the pedestal these words appear:</p>
              <p className="text-gray-300">‘My name is Ozymandias, King of Kings;</p>
              <p className="text-gray-300">Look on my Works, ye Mighty, and despair!’</p>
              <p className="text-gray-300">Nothing beside remains.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Ortovets. All rights reserved.</p>
          <Link href="/terminos" className="mt-2 inline-block hover:underline">Consulta nuestros Terminos y Condiciones</Link>
        </div>
      </div>
    </footer>
  );
}
