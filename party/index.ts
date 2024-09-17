import type * as Party from "partykit/server";
import {
  Action,
  balanceTeamByMMR,
  GameState,
  initGameState,
  Role,
  ServerAction,
} from "../game/logic";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  game: GameState | undefined;

  static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
    // get token from request query string
    const roles = new URL(request.url).searchParams.get("roles") ?? "";
    request.headers.set("roles", roles);

    // forward the request onwards on onConnect
    return request;
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );

    if (!this.game) {
      this.game = initGameState(conn.id);
    }

    const roles = ctx.request.headers.get("roles");
    this.game.users.push({
      id: conn.id,
      mmr: Math.floor(Math.random() * (1000 - 400) + 400),
      preferredRole: roles?.split(",") as Role[],
    });

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
      user: {
        id: sender.id,
        mmr: Math.floor(Math.random() * (1000 - 400) + 400),
      },
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

    if (action.type === "join-team") {
      const userAlreadyInTeam = this.game[action.payload].some(
        (user) => user.id === action.user.id,
      );

      if (!userAlreadyInTeam) {
        this.game[action.payload].push(action.user);

        // exit the user from the other team
        const otherTeam = action.payload === "teamRed" ? "teamBlue" : "teamRed";
        this.game[otherTeam] = this.game[otherTeam].filter(
          (user) => user.id !== action.user.id,
        );
      }
    }

    if (action.type === "balance-teams") {
      balanceTeamByMMR(this.game);
    }

    const everyoneReady = this.game.ready.length === this.game.users.length;
    if (everyoneReady) {
      console.log("Iniciar jogo...");
    }

    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(JSON.stringify(this.game));
  }
}

Server satisfies Party.Worker;
