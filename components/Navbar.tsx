"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Tienda",
    href: "/tienda",
    description: "Explora nuestra tienda",
  },
  {
    title: "Nosotros",
    href: "/nosotros",
    description: "Conoce más sobre nosotros",
  },
  {
    title: "Contacto",
    href: "/contacto",
    description: "Ponte en contacto con nosotros",
  },
  {
    title: "Consultas",
    href: "/consultas",
    description: "Agenda una consulta",
  },
  {
    title: "Noticias",
    href: "/noticias",
    description: "Lee nuestras últimas noticias",
  },
  {
    title: "MVZ",
    href: "/mvz",
    description: "Información para Médicos Veterinarios Zootecnistas",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Ortovets</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {components.map((component) => (
                <NavigationMenuItem key={component.title}>
                  <Link href={component.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {component.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Ortovets</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-6">
                {components.map((component) => (
                  <Link
                    key={component.title}
                    href={component.href}
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    {component.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
