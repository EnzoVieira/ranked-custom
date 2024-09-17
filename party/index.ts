import type * as Party from "partykit/server";
import { Action, GameState, ServerAction } from "../game/logic";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  game: GameState | undefined;

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );

    if (!this.game) {
      this.game = {
        users: [],
        ready: [],
        // board: [],
        // currentPlayer: 0,
        // winner: null,
      };
    }

    this.game.users.push({ id: conn.id });

    // let's send a message to the connection
    conn.send(JSON.stringify(this.game));

    // let's broadcast a message to all the other connections in the room
    this.room.broadcast(JSON.stringify(this.game));
  }

  onClose(connection: Party.Connection): void | Promise<void> {
    // A websocket just disconnected!
    console.log(`Connection ${connection.id} closed`);

    if (this.game) {
      this.game.users = this.game.users.filter(
        (user) => user.id !== connection.id,
      );
      this.game.ready = this.game.ready.filter(
        (userId) => userId !== connection.id,
      );
    }

    // let's broadcast a message to all the other connections in the room
    this.room.broadcast(JSON.stringify(this.game));
  }

  onMessage(message: string, sender: Party.Connection) {
    const action: ServerAction = {
      ...(JSON.parse(message) as Action),
      user: { id: sender.id },
    };

    console.log(`connection ${sender.id} sent action: ${action}`);

    if (!this.game) {
      return;
    }

    const userAlreadyReady = this.game.ready.some(
      (userId) => userId === action.user.id,
    );

    if (action.type === "ready" && !userAlreadyReady) {
      this.game.ready.push(action.user.id);
    }

    if (action.type === "ready" && userAlreadyReady) {
      this.game.ready = this.game.ready.filter(
        (userId) => userId !== action.user.id,
      );
    }

    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(JSON.stringify(this.game));
  }
}

Server satisfies Party.Worker;
