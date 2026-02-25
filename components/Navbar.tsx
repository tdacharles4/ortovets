"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { AuthButton } from "./AuthButton";

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

// This new component handles the auth logic for the navbar
function AuthNav() {
  const { isAuthenticated, login } = useAuth();

  // If the user is logged in, show the simple AuthButton which contains the logout logic
  if (isAuthenticated) {
    return <AuthButton />;
  }

  // If the user is logged out, show the Popover with Login and Register options
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
          <span className="sr-only">Login or Register</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mr-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Acceso de Clientes</h4>
            <p className="text-sm text-muted-foreground">
              Inicia sesión o crea una cuenta de veterinario.
            </p>
          </div>
          <div className="grid gap-2">
            <Button onClick={() => login()}>Ya tengo cuenta (Login)</Button>
            <Link href="/acceso" passHref>
              <Button variant="secondary" className="w-full">
                ¿Eres veterinario? Regístrate
              </Button>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffff]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center gap-10">
          <Link href="/">
            <Image src="/img/nav-logo.png" alt="Ortovets Logo" width={170} height={48} />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className={`${navigationMenuTriggerStyle()} text-base`}
                    >
                      {link.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar producto..."
              className="pl-9 w-full"
            />
          </div>
          <AuthNav /> {/* Correctly placed AuthNav component */}
          <ShoppingCart className="h-6 w-6 cursor-pointer" />
        </div>

        {/* Mobile View */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/">
            <Image src="/img/nav-logo.png" alt="Ortovets Logo" width={140} height={40} />
          </Link>
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
                    <AuthNav /> {/* Correctly placed AuthNav component */}
                  </div>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-lg font-semibold text-foreground/80 hover:text-foreground"
                  >
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
