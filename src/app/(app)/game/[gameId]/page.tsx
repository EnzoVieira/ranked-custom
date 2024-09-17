"use client";

import { Button } from "@/components/ui/button";
import { useGameRoom } from "@/hooks/use-game-room";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface GamePageProps {
  params: { gameId: string };
}

export default function GamePage({ params: { gameId } }: GamePageProps) {
  const params = useParams<{ gameId: string }>();
  const searchParams = useSearchParams();

  const username = searchParams.get("username")!;
  const roles = searchParams.get("roles")!;

  const { gameState, dispatch } = useGameRoom(username, params.gameId, roles);

  const amIReady = gameState?.ready.some((userId) => userId === username);

  function copyInviteLinkToClipboard() {
    const { origin } = window.location;

    const inviteLink = `${origin}/game?gameId=${gameId}`;

    navigator.clipboard.writeText(inviteLink);
  }

  return (
    <div className="px-4 pt-12 space-y-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl font-bold">Nome da sala: {gameId}</h1>
        <Button size="icon" onClick={copyInviteLinkToClipboard}>
          <Copy className="size-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Jogadores</h3>
        <ul>
          {gameState?.users.map((user) => {
            const isUserReady = gameState.ready.some(
              (userId) => userId === user.id,
            );

            return (
              <li key={user.id}>
                <span className="font-medium mr-2">
                  {user.id} - {user.mmr} Pontos
                </span>

                {gameState?.ownerId === user.id && <span>Dono </span>}

                {isUserReady ? <span>Pronto</span> : <span>Esperando...</span>}
                <div>Roles: {user.preferredRole}</div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-x-2">
        <Button variant="destructive" asChild>
          <Link href="/">Desconectar</Link>
        </Button>

        <Button
          variant={"secondary"}
          onClick={() => {
            dispatch({ type: "ready" });
          }}
        >
          {amIReady ? "Cancelar" : "Pronto"}
        </Button>
      </div>

      <div className="grid grid-cols-2 pt-12">
        <div className="col-span-full pb-4">
          {gameState?.ownerId === username && (
            <Button onClick={() => dispatch({ type: "balance-teams" })}>
              Balancear Times
            </Button>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-blue-400">Time Azul</h2>

          <ul>
            {gameState?.teamBlue.map((user) => (
              <li key={user.id}>
                <span className="font-medium mr-2">{user.id}</span>
                <span>{user.role} </span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => dispatch({ type: "join-team", payload: "teamBlue" })}
          >
            Entrar
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-red-400">Time Vermelho</h2>

          <ul>
            {gameState?.teamRed.map((user) => (
              <li key={user.id}>
                <span className="font-medium mr-2">{user.id}</span>
                <span>{user.role} </span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => dispatch({ type: "join-team", payload: "teamRed" })}
          >
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
