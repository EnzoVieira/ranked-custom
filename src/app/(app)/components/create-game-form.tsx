"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export function CreateGameForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const gameId = formData.get("gameId");

    router.push(`/game/${gameId}?username=${username}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" type="text" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="gameId">Nome da sala</Label>
        <Input id="gameId" name="gameId" type="text" />
      </div>

      <Button variant="secondary" type="submit">
        Criar jogo
      </Button>
    </form>
  );
}
