import type { Metadata } from "next";
import { Playpen_Sans, Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { CartProvider } from "./context/cartContext";

const playpenSans = Playpen_Sans({
  variable: "--font-playpen",
  subsets: ["latin"],
  weight: ["800"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ortovets",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playpenSans.variable} ${quicksand.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
            <Toaster position="top-center" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
