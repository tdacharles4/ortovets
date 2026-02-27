"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const signupSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Introduce un correo electrónico válido.",
  }),
  isVet: z.boolean(),
  cedula: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones.",
  }),
}).refine((data) => {
  if (data.isVet && (!data.cedula || data.cedula.length < 5)) {
    return false;
  }
  return true;
}, {
  message: "La cédula profesional es obligatoria para médicos veterinarios y debe tener al menos 5 caracteres.",
  path: ["cedula"],
});

function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      isVet: false,
      cedula: "",
      acceptTerms: false,
    },
  });

  const isVet = form.watch("isVet");

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setMessage(data.message);
        form.reset();
      } else {
        setSuccess(false);
        if (data.message === 'Email has already been taken') {
            setMessage("El correo ya esta registrado en esta tienda.");
        } else {
            setMessage(data.message || "Ocurrió un error.");
        }
      }
    } catch (error) {
      setSuccess(false);
      setMessage("No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  }
  
  if (success) {
    return (
      <div className="text-center p-4 border rounded-md bg-green-50 border-green-200">
        <p className="text-green-800">{message}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {message && (
            <Alert variant={success ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{success ? 'Éxito' : 'Error de Registro'}</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <FormLabel>Apellido(s)</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} disabled={loading} />
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
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="juan@ejemplo.com" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isVet"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      form.setValue("cedula", "");
                    }
                  }}
                  disabled={loading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Soy Médico Veterinario Zootecnista
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cedula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cédula Profesional</FormLabel>
              <FormControl>
                <Input 
                  placeholder="12345678" 
                  {...field} 
                  disabled={loading || !isVet} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="py-2">
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <div className="grid gap-1.5 leading-none">
                  <FormLabel>
                    He leído y acepto los{" "}
                    <Link href="#" className="text-blue-600 hover:underline">
                      Términos y Condiciones
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>
    </Form>
  );
}

// New component for the login tab content
function LoginTabContent() {
    const { login } = useAuth();
    return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm text-gray-600">
                Si ya tienes una cuenta, inicia sesión de forma segura a través de Shopify.
            </p>
            <Button onClick={() => login()}>Ya tengo cuenta (Login)</Button>
        </div>
    );
}

export default function AccesoPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Acceso de Clientes</CardTitle>
          <CardDescription>
            Inicia sesión o regístrate para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginTabContent />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
