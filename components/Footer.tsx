import Image from "next/image";
import { Facebook, Instagram, Youtube, Link as LinkIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E2939] text-white p-8 h-[468px] flex flex-col justify-center"> {/* Added flex flex-col justify-center */}
      <div className="flex gap-x-20">
        {/* Left Block */}
        <div className="flex flex-col items-start">
          <Image src="/img/nav-logo.png" alt="Ortovets Logo" width={170} height={48} />
          <div className="flex space-x-6 mt-6">
            <Facebook className="h-7 w-7" />
            <LinkIcon className="h-7 w-7" />
            <Instagram className="h-7 w-7" />
            <Youtube className="h-7 w-7" />
          </div>
        </div>

        {/* Right Block */}
        <div className="flex space-x-12">
          {/* List 1 */}
          <div className="flex flex-col space-y-2 text-sm">
            <p className="font-bold mb-2">About</p>
            <p>I met a traveller from an antique land</p>
            <p>Who said—“Two vast and trunkless legs of stone</p>
            <p>Stand in the desert. . . . Near them, on the sand,</p>
            <p>Half sunk, a shattered visage lies</p>
          </div>
          {/* List 2 */}
          <div className="flex flex-col space-y-2 text-sm">
            <p className="font-bold mb-2">Explore</p>
            <p>whose frown, And wrinkled lip, and sneer of cold command,</p>
            <p>Tell that its sculptor well those passions read</p>
            <p>Which yet survive, stamped on these lifeless things,</p>
            <p>The hand that mocked them, and the heart that fed;</p>
          </div>
          {/* List 3 */}
          <div className="flex flex-col space-y-2 text-sm">
            <p className="font-bold mb-2">Legacy</p>
            <p>And on the pedestal these words appear:</p>
            <p>‘My name is Ozymandias, King of Kings;</p>
            <p>Look on my Works, ye Mighty, and despair!’</p>
            <p>Nothing beside remains.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
