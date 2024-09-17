export interface User {
  id: string;
  mmr: number;
}

type WithUser<T> = T & { user: User };

export type DefaultAction =
  | { type: "user-entered"; state: BaseGameState }
  | { type: "user-exit"; state: BaseGameState };

type GameAction =
  | { type: "ready" | "balance-teams" }
  | { type: "join-team"; payload: "teamRed" | "teamBlue" };

export type Action = DefaultAction | GameAction;

export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

interface BaseGameState {
  users: User[];
  ownerId: string;
}

export interface GameState extends BaseGameState {
  ready: string[];
  teamRed: User[];
  teamBlue: User[];
}

export function initGameState(ownerId: string): GameState {
  const randomUsers: User[] = Array.from({ length: 8 }, (_, i) => ({
    id: `user-${i + 1}`,
    mmr: Math.floor(Math.random() * (1000 - 50) + 50),
  }));
  const readyUsers: string[] = Array.from(
    { length: 8 },
    (_, i) => `user-${i + 1}`,
  );

  return {
    ownerId,
    users: randomUsers,
    ready: readyUsers,
    teamBlue: [],
    teamRed: [],
    // board: [],
    // currentPlayer: 0,
    // winner: null,
  };
}

export function balanceTeamByMMR(game: GameState) {
  // sort users by mmr in descending order
  const sortedUsers = [...game.users].sort((a, b) => b.mmr - a.mmr);
  console.log(sortedUsers);

  // split users into two teams
  const teamRed = sortedUsers.filter((_, i) => i % 2 === 0);
  const teamBlue = sortedUsers.filter((_, i) => i % 2 !== 0);

  game.teamRed = teamRed;
  game.teamBlue = teamBlue;
}
