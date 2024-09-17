"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export function GameInvtedForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const gameId = searchParams.get("gameId");

    router.push(`/game/${gameId}?username=${username}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" />
      </div>

      <Button variant="secondary" type="submit">
        Entrar
      </Button>
    </form>
  );
}
