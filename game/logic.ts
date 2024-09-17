export interface User {
  id: string;
}

type WithUser<T> = T & { user: User };

export type DefaultAction =
  | { type: "user-entered"; state: BaseGameState }
  | { type: "user-exit"; state: BaseGameState };

type GameAction =
  | { type: "ready" }
  | { type: "join-team"; payload: "teamRed" | "teamBlue" };

export type Action = DefaultAction | GameAction;

export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

interface BaseGameState {
  users: User[];
}

export interface GameState extends BaseGameState {
  ready: string[];
  teamRed: User[];
  teamBlue: User[];
}
