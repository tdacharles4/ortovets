"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, ShoppingCart } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navLinks: { title: string; href: string; description: string }[] = [
  {
    title: "Inicio",
    href: "/",
    description: "Página principal",
  },
  {
    title: "Tienda",
    href: "/tienda",
    description: "Explora nuestra tienda",
  },
  {
    title: "¿Quiénes somos?",
    href: "/nosotros",
    description: "Conoce más sobre nosotros",
  },
  {
    title: "Contacto",  
    href: "/contacto",
    description: "Ponte en contacto con nosotros",
  },
  {
    title: "Agenda Consulta",
    href: "/consultas",
    description: "Agenda una consulta",
  },
  {
    title: "Recursos",
    href: "/noticias",
    description: "Lee nuestras últimas noticias",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#D9D9D9]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="hidden md:flex items-center gap-10">
          <Link href="/">
            <Image src="/img/nav-logo.png" alt="Ortovets Logo" width={170} height={48} />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.title}>
                  <Link href={link.href}>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-base`}>
                      {link.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar producto..." className="pl-9 w-full" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <User className="h-6 w-6 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="flex flex-col space-y-4 items-start">
                <Button asChild variant="outline">
                  <Link href="/mvz/registro">¿Eres veterinario? Regístrate...</Link>
                </Button>
                <Button asChild>
                  <Link href="/mvz/login">Ya estoy registrado</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <ShoppingCart className="h-6 w-6 cursor-pointer" />
        </div>

        {/* Mobile View */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Mobile Logo */}
          <Link href="/">
            <Image src="/img/nav-logo.png" alt="Ortovets Logo" width={140} height={40} />
          </Link>
          
          {/* Mobile Menu (Hamburger) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-8">
              <div className="flex flex-col gap-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar..." className="pl-9" />
                </div>
                <nav className="flex flex-col gap-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-lg font-semibold text-foreground/80 hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  ))}
                </nav>
                <div className="border-b"></div>
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-2">
                    <Button asChild variant="outline">
                      <Link href="/mvz/registro">¿Eres veterinario? Regístrate...</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/mvz/login">Ya estoy registrado</Link>
                    </Button>
                  </div>
                  <Link href="/cart" className="flex items-center gap-2 text-lg font-semibold text-foreground/80 hover:text-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Carrito</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
