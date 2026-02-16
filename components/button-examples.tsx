"use client";

import { Button } from "@/components/ui/button";

export function ButtonExamples() {
  const handleClick = (variant: string) => {
    console.log(`${variant} button clicked`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Button Examples</h2>
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => handleClick("Default")}>Default</Button>
        <Button variant="destructive" onClick={() => handleClick("Destructive")}>
          Destructive
        </Button>
        <Button variant="ghost" onClick={() => handleClick("Ghost")}>
          Ghost
        </Button>
        <Button variant="link" onClick={() => handleClick("Link")}>
          Link
        </Button>
        <Button variant="outline" onClick={() => handleClick("Outline")}>
          Outline
        </Button>
        <Button variant="secondary" onClick={() => handleClick("Secondary")}>
          Secondary
        </Button>
      </div>
    </div>
  );
}
