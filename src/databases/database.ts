import { PlayerLevel } from '../models/player-level';
import { PlayerPlaytime } from '../models/player-playtime';
import { PlayerRank } from '../models/player-rank';
import { PlayerStats } from '../models/player-stats';
import { PlayerUsername } from '../models/player-username';

export enum R6Collection {
  level = 'level',
  playtime = 'playtime',
  rank = 'rank',
  stats = 'stats',
  username = 'username'
}

export type R6Class = PlayerLevel | PlayerPlaytime | PlayerRank | PlayerStats | PlayerUsername;

export abstract class Database {
  abstract init(): Promise<void>;
  abstract get(collection: R6Collection, id: string): Promise<R6Class>;
  abstract insert(collection: R6Collection, data: R6Class): Promise<void>;
  abstract update(collection: R6Collection, id: string, data: R6Class): Promise<void>;
  abstract isOnline(): boolean;
}