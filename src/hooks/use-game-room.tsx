import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Action, GameState } from "../../game/logic";

export function useGameRoom(username: string, roomId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_SERVER_URL || "localhost:1999",
    room: roomId,
    id: username,

    onOpen() {
      console.log("Socket connected");
    },

    onMessage(event: MessageEvent<string>) {
      console.log("onMessage", event.data);

      setGameState(JSON.parse(event.data));
    },

    onClose() {
      console.log("Socket closed");
    },

    onError(err) {
      console.error("Socket error", err);
    },
  });

  const dispatch = (action: Action) => {
    socket.send(JSON.stringify(action));
  };

  return {
    gameState,
    dispatch,
  };
}
