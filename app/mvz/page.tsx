import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Mvz() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col space-y-4">
        <Button asChild size="lg">
          <Link href="/mvz/registro">Eres veterinario? Registrate...</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/mvz/login">Ya estoy registrado</Link>
        </Button>
      </div>
    </div>
  );
}
