import { IGetRanks } from 'r6api.js/dist/methods/getRanks';
import { IGetStats } from 'r6api.js/dist/methods/getStats';
import { PlayerLevel } from './player-level';
import { PlayerPlaytime } from './player-playtime';
import { PlayerUsername } from './player-username';

export interface PlayerDoc {
  player: string;
  hash?: string;
  timestamp?: number;
  level: PlayerLevel,
  playtime: PlayerPlaytime,
  rank: IGetRanks,
  stats: IGetStats,
  username: PlayerUsername
}