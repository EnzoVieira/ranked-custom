"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "next/navigation";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { FormEvent } from "react";

export function CreateGameForm() {
  const router = useRouter();
  const [preferredRoles, setPreferedRoles] = useQueryState(
    "roles",
    parseAsArrayOf(parseAsString, ","),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const gameId = formData.get("gameId");

    router.push(`/game/${gameId}?username=${username}&roles=${preferredRoles}`);
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

      <div className="space-y-1.5">
        <Label>Funções Preferidas</Label>
        <ToggleGroup
          type="multiple"
          variant="outline"
          className="justify-start"
          onValueChange={setPreferedRoles}
          defaultValue={preferredRoles ?? undefined}
        >
          <ToggleGroupItem value="top">Top Laner</ToggleGroupItem>
          <ToggleGroupItem value="jungle">Jungler</ToggleGroupItem>
          <ToggleGroupItem value="mid">Mid Laner</ToggleGroupItem>
          <ToggleGroupItem value="adc">ADC</ToggleGroupItem>
          <ToggleGroupItem value="support">Suporte</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Button variant="secondary" type="submit">
        Criar jogo
      </Button>
    </form>
  );
}
