export type Role = "top" | "jungle" | "mid" | "adc" | "support";

export interface User {
  id: string;
  mmr: number;
  preferredRole?: Role[];
}

interface UserWithRole extends User {
  role?: Role;
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
  teamRed: UserWithRole[];
  teamBlue: UserWithRole[];
}

// TODO: delete this test func
function getRandomRoles(): Role[] | undefined {
  const availableRoles: Role[] = ["adc", "jungle", "mid", "support", "top"];

  const randomRole =
    availableRoles[Math.floor(Math.random() * availableRoles.length)];
  const rand = Boolean(Math.round(Math.random()));

  return rand ? [randomRole] : undefined;
}

export function initGameState(ownerId: string): GameState {
  const randomUsers: User[] = Array.from({ length: 8 }, (_, i) => ({
    id: `user-${i + 1}`,
    mmr: Math.floor(Math.random() * (1000 - 50) + 50),
    preferredRole: getRandomRoles(),
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
  };
}

function assignPlayer(player: User, team: UserWithRole[]) {
  // if user does not have a preferred role, return false
  if (!player.preferredRole) return false;

  for (let role of player.preferredRole) {
    const isRoleTaken = team.some((user) => user.role === role);

    if (!isRoleTaken) {
      team.push({ ...player, role });
      return true;
    }
  }

  return false;
}

function fillRemainingPositions(player: User, team: UserWithRole[]) {
  const roles = ["top", "jungle", "mid", "adc", "support"] as const;

  for (let role of roles) {
    const isRoleTaken = team.some((user) => user.role === role);

    if (!isRoleTaken) {
      team.push({ ...player, role });
      break;
    }
  }
}

export function balanceTeamByMMR(game: GameState) {
  // sort users by mmr in descending order
  const sortedUsers = [...game.users].sort((a, b) => b.mmr - a.mmr);

  const teamRed: UserWithRole[] = [];
  const teamBlue: UserWithRole[] = [];

  const unassignedPlayers: User[] = [];

  let index = 0;
  // assign roles alternately between blue and red teams
  for (; index < sortedUsers.length; index++) {
    const player = sortedUsers[index];

    let assigned: boolean;

    if (index % 2 === 0) assigned = assignPlayer(player, teamBlue);
    else assigned = assignPlayer(player, teamRed);

    if (!assigned) unassignedPlayers.push(player);
  }

  while (unassignedPlayers.length) {
    if (index % 2 === 0 && teamBlue.length < 5)
      fillRemainingPositions(unassignedPlayers.pop()!, teamBlue);
    else if (index % 2 !== 0 && teamRed.length < 5)
      fillRemainingPositions(unassignedPlayers.pop()!, teamRed);

    index++;
  }

  game.teamRed = teamRed;
  game.teamBlue = teamBlue;
}
