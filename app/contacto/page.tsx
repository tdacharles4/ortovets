"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Introduce un correo electrónico válido.",
  }),
  phone: z.string().min(10, {
    message: "Introduce un número de teléfono válido (mínimo 10 dígitos).",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres.",
  }),
});

function ContactForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("¡Mensaje enviado con éxito!", {
          description: "Nos pondremos en contacto contigo pronto.",
        });
        form.reset();
      } else {
        toast.error("Error al enviar el mensaje.", {
          description: data.message || "Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      toast.error("Error de conexión.", {
        description: "No se pudo conectar al servidor.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full lg:w-[632px] h-fit lg:h-[736px] bg-[#FFFFFFCC] rounded-[20px] border border-[#E5E5E5] px-6 md:px-[32px] py-8 md:py-[40px] flex flex-col justify-between shadow-sm shrink-0 backdrop-blur-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#1E1E1E] font-sans font-bold text-2xl md:text-[32px] leading-tight text-center lg:text-left">
            Cuéntanos qué necesitas
          </h2>
          <p className="text-[#757575] font-sans font-normal text-base md:text-lg text-center lg:text-left">
            Estamos aquí para ayudarte a cuidar a quien más quieres.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E1E1E] font-sans font-medium text-base">Nombre(s)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} className="h-12 bg-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1E1E1E] font-sans font-medium text-base">Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} className="h-12 bg-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E1E1E] font-sans font-medium text-base">Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={loading} className="h-12 bg-white/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E1E1E] font-sans font-medium text-base">Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} className="h-12 bg-white/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1E1E1E] font-sans font-medium text-base">Cuéntanos más detalles</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="min-h-[120px] lg:min-h-[140px] resize-none bg-white/50" 
                      {...field} 
                      disabled={loading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <Button 
        type="submit" 
        onClick={form.handleSubmit(onSubmit)}
        className="w-full h-14 bg-[#4C83DC] hover:bg-[#3b6bb8] text-white font-bold text-lg rounded-[12px] transition-all shadow-lg shadow-[#4C83DC]/20 mt-8" 
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </div>
  );
}

export default function ContactoPage() {
  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center bg-[url('/img/contacto-bg.png')] bg-cover bg-center overflow-hidden py-12 px-4 md:px-8">
      <div className="absolute inset-0 bg-black/5" />
      
      {/* Container for siblings */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-[64px] max-w-[1810px] w-full">
        {/* Content Frame */}
        <div className="w-full lg:w-fit flex flex-col items-center lg:items-start justify-between gap-12 lg:h-[674px]">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h1 className="text-[#1E2939] font-sans font-extrabold text-3xl md:text-5xl lg:text-[48px] leading-tight">
              Tu Tienes Preguntas,<br />Nosotros Respuestas
            </h1>
            <p className="text-[#757575] font-sans font-medium text-lg md:text-[20px] leading-snug max-w-[500px] mx-auto lg:mx-0">
              Si tienes dudas, necesitas orientación o deseas información sobre nuestros productos o servicios. Puedes comunicarte con nosotros a través de los siguientes medios.
            </p>
          </div>

          {/* Info Frame */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-[40px] w-full max-w-[600px] lg:max-w-none lg:flex lg:flex-row lg:items-center">
            {/* Frame 1: Ubicación */}
            <div className="flex flex-col justify-start gap-1 text-center lg:text-left">
              <h3 className="text-[#5A5A5A] font-sans font-semibold text-base leading-[1.2]">
                Ubicación
              </h3>
              <p className="text-[#757575] font-sans font-regular text-[14px] leading-[1.2] max-w-[200px] mx-auto lg:mx-0">
                Tlapacoyan 14, Inmecafe, 91190 Xalapa-Enríquez, Ver.
              </p>
            </div>

            {/* Frame 2: Email */}
            <div className="flex flex-col justify-start gap-1 text-center lg:text-left">
              <h3 className="text-[#5A5A5A] font-sans font-semibold text-base leading-[1.2]">
                Email
              </h3>
              <p className="text-[#757575] font-sans font-regular text-[14px] leading-[1.2]">
                ortovets@gmail.com
              </p>
            </div>

            {/* Frame 3: Contacto */}
            <div className="flex flex-col justify-start gap-1 text-center lg:text-left">
              <h3 className="text-[#5A5A5A] font-sans font-semibold text-base leading-[1.2]">
                Contacto
              </h3>
              <p className="text-[#757575] font-sans font-regular text-[14px] leading-[1.2]">
                +(52) 228 257 9865
              </p>
            </div>

            {/* Frame 4: Redes Sociales */}
            <div className="flex flex-col justify-start gap-1 text-center lg:text-left">
              <h3 className="text-[#5A5A5A] font-sans font-semibold text-base leading-[1.2]">
                Redes Sociales
              </h3>
              <div className="text-[#757575] font-sans font-regular text-[14px] leading-[1.2] flex flex-col">
                <span>Instagram</span>
                <span>Facebook</span>
                <span>Youtube</span>
                <span>Tiktok</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Frame */}
        <ContactForm />
      </div>
    </div>
  );
}
