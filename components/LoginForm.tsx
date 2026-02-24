"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";

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
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";

const formSchema = z.object({
  username: z.string().min(8, {
    message: "Usuario incorrecto o inexistente.",
  }),
  password: z.string().min(4, {
    message: "Contraseña no coincide con el usuario ingresado.",
  }),
});

export function LoginForm({ onBack }: { onBack?: () => void }) {

  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: values.username, password: values.password}),
    });

    const data = await response.json();
  
    if (response.ok) {
      alert('estas logeado')
    } else {
      setError(data.error || 'login fallido')
    }
  }


  return (
    <div>
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="contraseña" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Acceder
          </Button>
        </form>
      </Form>
    </div>
  );
}
