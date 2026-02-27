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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomer } from "@/hooks/useCustomer";
import { getProduct, ShopifyProduct } from "@/lib/shopify";
import { FloatingProductCard } from "./FloatingProductCard";

type SearchResult = {
  handle: string;
  title: string;
  imageUrl?: string;
};

const navLinks: { title: string; href: string; description: string }[] = [
  { title: "Inicio", href: "/", description: "Página principal" },
  { title: "Tienda", href: "/tienda", description: "Explora nuestra tienda" },
  { title: "¿Quiénes somos?", href: "/nosotros", description: "Conoce más sobre nosotros" },
  { title: "Contacto", href: "/contacto", description: "Ponte en contacto con nosotros" },
  { title: "Agenda Consulta", href: "/consultas", description: "Agenda una consulta" },
  { title: "Recursos", href: "/noticias", description: "Lee nuestras últimas noticias" },
];

function AuthNav() {
  const { isAuthenticated, login, logout } = useAuth();
  const { customer, loading } = useCustomer();

  if (isAuthenticated) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon"><User className="h-6 w-6" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                {loading ? "Cargando..." : `Hola, ${customer?.firstName || 'Usuario'}`}
              </h4>
              <p className="text-sm text-muted-foreground">Administra tu cuenta y tus órdenes.</p>
            </div>
            <div className="grid gap-2">
              <Link href="/cuenta" passHref>
                <Button variant="secondary" className="w-full">Perfil</Button>
              </Link>
              <Button onClick={logout}>Cerrar Sesión</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon"><User className="h-6 w-6" /></Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mr-4">
        <div className="grid gap-4">
          <div className="space-y-2 text-center"><h4 className="font-medium leading-none">Acceso</h4></div>
          <div className="grid gap-2">
            <Button onClick={() => login()}>Iniciar Sesión</Button>
            <Link href="/acceso" passHref><Button variant="secondary" className="w-full">¿Eres veterinario? Regístrate</Button></Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  
  const [selectedProduct, setSelectedProduct] = React.useState<ShopifyProduct | null>(null);
  const [activeProductHandle, setActiveProductHandle] = React.useState<string | null>(null);
  const [isFloatingCardOpen, setIsFloatingCardOpen] = React.useState(false);

  const searchRef = React.useRef<HTMLDivElement>(null);

  // Effect for closing the search dropdown when clicking outside
  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Effect for debouncing the search query
  React.useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      const response = await fetch(`/api/search?query=${searchQuery}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
        setIsSearchOpen(results.length > 0);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  // Effect for handling the product click, which solves the race condition
  React.useEffect(() => {
    if (!activeProductHandle) return;

    const fetchAndOpenProduct = async () => {
      try {
        const response = await fetch(`/api/products/${activeProductHandle}`);
        if (response.ok) {
          const product = await response.json();
          setSelectedProduct(product);
          setIsFloatingCardOpen(true);
        } else {
          console.error("Failed to fetch product details:", await response.text());
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        // Cleanup after the effect is done
        setActiveProductHandle(null);
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    fetchAndOpenProduct();
  }, [activeProductHandle]); // This effect runs only when a product handle is set

  return (
    <div className="relative flex-1 max-w-md" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar producto..."
        className="pl-9 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchOpen(searchQuery.length > 1 && searchResults.length > 0)}
      />
      {isSearchOpen && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg z-50">
          <ScrollArea 
            className="h-fit max-h-72"
            onMouseDown={(e) => e.preventDefault()} // Prevents closing before click registers
          >
            <ul>
              {searchResults.map((product) => (
                <li
                  key={product.handle}
                  className="p-4 border-b last:border-b-0 hover:bg-muted cursor-pointer flex items-center gap-4"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setActiveProductHandle(product.handle);
                  }}
                >
                  <Image
                    src={product.imageUrl || "/img/dummyproduct.png"}
                    alt={product.title}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <span>{product.title}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      <Dialog open={isFloatingCardOpen} onOpenChange={setIsFloatingCardOpen}>
        <DialogContent 
          className="p-0 bg-transparent border-none max-w-[95vw] sm:max-w-none w-fit shadow-none outline-none"
          showCloseButton={false}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedProduct?.title || "Producto"}</DialogTitle>
            <DialogDescription>{selectedProduct?.description || "Detalles del producto"}</DialogDescription>
          </DialogHeader>
          {selectedProduct && <FloatingProductCard product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffff]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center gap-10">
          <Link href="/"><Image src="/img/nav-logo.png" alt="Ortovets Logo" width={170} height={48} /></Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.title}>
                  <NavigationMenuLink asChild>
                    <Link href={link.href} className={`${navigationMenuTriggerStyle()} text-base`}>
                      {link.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <SearchBar />
          <AuthNav />
          <ShoppingCart className="h-6 w-6 cursor-pointer" />
        </div>

        {/* Mobile View */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/"><Image src="/img/nav-logo.png" alt="Ortovets Logo" width={140} height={40} /></Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-8">
              <div className="flex flex-col gap-y-6">
                <SearchBar />
                <nav className="flex flex-col gap-y-4">
                  {navLinks.map((link) => (
                    <Link key={link.title} href={link.href} className="text-lg font-semibold text-foreground/80 hover:text-foreground">
                      {link.title}
                    </Link>
                  ))}
                </nav>
                <div className="border-b"></div>
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-2"><AuthNav /></div>
                  <Link href="/cart" className="flex items-center gap-2 text-lg font-semibold text-foreground/80 hover:text-foreground">
                    <ShoppingCart className="h-5 w-5" /><span>Carrito</span>
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
