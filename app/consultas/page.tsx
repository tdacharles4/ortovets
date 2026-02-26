"use client";

import { useState } from "react";
import { FileText, ArrowUpRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";

const appointmentSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  phone: z.string().min(10, "Introduce un teléfono válido"),
  email: z.string().email("Introduce un email válido"),
  petName: z.string().min(1, "El nombre de la mascota es obligatorio"),
  breed: z.string().min(1, "La raza es obligatoria"),
  age: z.string().min(1, "La edad es obligatoria"),
  details: z.string().min(10, "Por favor describe los detalles (mín. 10 caracteres)"),
});

function AppointmentForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      petName: "",
      breed: "",
      age: "",
      details: "",
    },
  });

  async function onSubmit(values: z.infer<typeof appointmentSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Solicitud enviada", {
          description: "Te contactaremos por WhatsApp para confirmar tu cita.",
        });
        setOpen(false);
        form.reset();
      } else {
        toast.error("Error al enviar la solicitud.", {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre(s)</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} disabled={loading} />
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
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="55 1234 5678" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="juan@ejemplo.com" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="petName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Mascota</FormLabel>
                <FormControl>
                  <Input placeholder="Firulais" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raza</FormLabel>
                <FormControl>
                  <Input placeholder="Labrador" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad</FormLabel>
                <FormControl>
                  <Input placeholder="3 años" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuéntanos más detalles</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} disabled={loading} />
              </FormControl>
              <p className="text-[12px] text-gray-500 mt-1 italic">
                Recomendaciones: describe los síntomas con el mayor detalle posible, mantente pendiente de tu WhatsApp para la confirmación y ten fotos o videos listos para compartir durante la consulta
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-[#4C83DC] text-[#4C83DC] hover:bg-[#4C83DC]/10"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#4C83DC] hover:bg-[#3b6bb8] text-white"
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function ConsultasPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full items-center bg-[#F5F1E6]">
      <section className="relative w-full max-w-[1920px] h-[540px] bg-[url('/img/consultas-icon.png')] bg-no-repeat bg-right-bottom bg-contain flex items-center">
        
        {/* Content Frame - 1114w fixed vertical flow */}
        <div className="w-[1114px] h-full flex flex-col justify-center py-[48px] pl-[100px] gap-[48px]">
          
          {/* Title and Subtitle Container */}
          <div className="flex flex-col gap-4 max-w-[800px]">
            <h1 className="text-[#1E2939] font-sans font-extrabold text-[48px] leading-tight">
              Agenda Tu Consulta Virtual
            </h1>
            <p className="text-[#757575] font-sans font-medium text-[24px] leading-[1.2]">
              Tu mascota merece atención profesional sin salir de casa. Completa el formulario y nos pondremos en contacto contigo para coordinar tu consulta virtual.
            </p>
          </div>

          {/* Steps Container */}
          <div className="flex flex-col gap-2">
            <p className="text-[#757575] font-sans font-bold text-[24px] leading-relaxed">
              Paso 1 — Completa la información de tu mascota
            </p>
            <p className="text-[#757575] font-sans font-bold text-[24px] leading-relaxed">
              Paso 2 — Envía tu solicitud
            </p>
            <p className="text-[#757575] font-sans font-bold text-[24px] leading-relaxed">
              Paso 3 — Te contactamos por WhatsApp para confirmar horario
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="flex">
                  <button className="flex items-center justify-center gap-2 bg-[#8CC63F] text-[#F5F5F5] font-sans font-semibold text-[24px] px-8 py-3 rounded-full hover:bg-[#7ab236] transition-all shadow-lg shadow-[#8CC63F]/20 border-none cursor-pointer">
                    <FileText className="w-6 h-6" />
                    Llenar Formulario
                  </button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[600px] bg-white rounded-[20px]">
                <DialogHeader>
                  <DialogTitle className="text-[24px] font-bold text-[#1E2939]">Formulario - Cita Virtual</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos para coordinar la consulta virtual de tu mascota.
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm setOpen={setOpen} />
              </DialogContent>
            </Dialog>

            <a 
              //href="https://wa.me/522282579865" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#757575] font-sans font-semibold text-base hover:text-[#8CC63F] transition-all w-fit group"
            >
              Continuar en Whatsapp
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Dra. Info Frame - 560w103h fixed */}
        <div className="absolute right-[64px] bottom-[48px] w-[560px] h-[103px] bg-[#FFFFFF99] px-[16px] py-[12px] flex flex-col gap-[10px] rounded-md shadow-sm">
          <h2 className="text-[#1E2939] font-sans font-extrabold text-[24px] leading-none">
            Dra. Gabriela Mateos Trigos
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-[#1E2939] font-sans font-medium text-[16px] leading-tight">
              LICENCIATURA EN MEDICINA VETERINARIA Y ZOOTECNIA: 1458193
            </p>
            <p className="text-[#1E2939] font-sans font-medium text-[16px] leading-tight">
              MAESTRÍA EN CIENCIAS FISIOLÓGICA: 2056201
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
