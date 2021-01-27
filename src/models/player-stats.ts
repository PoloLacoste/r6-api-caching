export class Casual {
  name: string;
  kills: number;
  deaths: number;
  wins: number;
  losses: number;
  matches: number;
  playtime: number;
}

export class Queue {
  casual: Casual;
  ranked: Casual;
  discovery: Casual;
}

export class Secure {
  name: string;
  wins: number;
  losses: number;
  matches: number;
  bestScore: number;
  playtime: number;
  secured: number;
  defended: number;
  contested: number;
}

export class Hostage {
  name: string;
  wins: number;
  losses: number;
  matches: number;
  bestScore: number;
  playtime: number;
  hostageRescued?: number;
  hostageDefended?: number;
}

export class PvpModes {
  bomb: Hostage;
  secure: Secure;
  hostage: Hostage;
}

export class General {
  kills: number;
  deaths: number;
  headshots: number;
  bulletsFired: number;
  bulletsConnected: number;
  timesChosen: number;
  name?: string;
  image?: string;
}

export class Weapon {
  general: General;
  list: General[];
}

export class Operator {
  name: string;
  role: Role;
  badge: string;
  ctu: string;
  kills: number;
  deaths: number;
  wins: number;
  losses: number;
  headshots: number;
  meleeKills: number;
  dbno: number;
  xp: number;
  playtime: number;
  gadget: Gadget[] | null;
}

export class GeneralStats {
  bulletsFired:           number;
  bulletsConnected:       number;
  kills:                  number;
  deaths:                 number;
  assists:                number;
  headshots:              number;
  meleeKills:             number;
  penetrationKills:       number;
  blindKills:             number;
  dbno:                   number;
  dbnoAssists:            number;
  revives:                number;
  matches:                number;
  wins:                   number;
  losses:                 number;
  playtime:               number;
  gadgetsDestroyed:       number;
  rappelBreaches:         number;
  barricadesDeployed:     number;
  reinforcementsDeployed: number;
  suicides:               number;
  distanceTravelled:      number;
  customGamesPlaytime:    number;
}

export class Pvp {
  weapons: { [key: string]: Weapon };
  operators: { [key: string]: Operator };
  general: GeneralStats;
  modes: PvpModes;
  queue: Queue;
}

export class Coop {
  normal: number;
  hard: number;
  realistic: number;
}

export class Types {
  local: Coop;
  coop: Coop;
}

export enum Role {
  Attacker = "attacker",
  Defender = "defender",
  Recruit = "recruit",
}

export class Gadget {
  name: string;
  value: number;
}

export class Classic {
  wins: number;
  losses: number;
  matches: number;
  bestScore: number;
}

export class PveModes {
  classic: Classic;
  protection: Classic;
  extraction: Classic;
  bomb: Classic;
}

export class Pve {
  weapons: { [key: string]: Weapon };
  operators: { [key: string]: Operator };
  general: GeneralStats;
  modes: PveModes;
  types: Types;
}

export class PlayerStats {
  id: string;
  pvp: Pvp;
  pve: Pve;
}