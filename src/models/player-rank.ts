export class LastMatch {
  mmrChange:        number;
  won:              boolean;
  skillStdevChange: number;
}

export enum Name {
  Bronze1 = "Bronze 1",
  Silver2 = "Silver 2",
  Unranked = "Unranked",
}

export class Current {
  name:  Name;
  id:    number;
  mmr:   number;
  image: string;
}

export enum Region {
  Emea = "emea",
}

export class Emea {
  region:                Region;
  skillMean:             number;
  skillStdev:            number;
  current:               Current;
  max:                   Current;
  lastMatch:             LastMatch;
  previousMmr:           number;
  nextMmr:               number;
  nextRankMatchesNeeded: number;
  topRankPosition:       number;
  kills:                 number;
  deaths:                number;
  wins:                  number;
  losses:                number;
  matches:               number;
  abandons:              number;
  updateTime:            string;
}

export class Regions {
  emea: Emea;
}

export class Season {
  id:      number;
  name:    string;
  color:   string;
  image:   string;
  regions: Regions;
}

export class PlayerRank {
  id:      string;
  seasons: { [key: string]: Season };
}