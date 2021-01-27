export class LootboxProbability {
  raw: number;
  percent: string;
}

export class PlayerLevel {
  id: string;
  level: number;
  xp: number;
  lootboxProbability: LootboxProbability;
}