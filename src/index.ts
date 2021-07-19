import { R6Service } from './services/r6.service';
import { CacheService } from './services/cache.service';
import { ServerStatus } from './models/server-status';
import { PlayerUsername } from './models/player-username';
import { PlayerPlaytime } from './models/player-playtime';
import { PlayerLevel } from './models/player-level';
import { PlayerId } from './models/player-id';
import { PlayerDoc } from './models/player-doc';
import { MongoDatabase } from './databases/mongo.database';
import { R6Collection, R6Class, Database } from './databases/database';

import { IGetRanks } from 'r6api.js/dist/methods/getRanks';
import { IGetStats } from 'r6api.js/dist/methods/getStats';
import { Platform, PlatformAll, PlatformAllExtended } from 'r6api.js/dist/typings';

export {
  R6Collection,
  R6Class,
  Database,
  MongoDatabase,
  PlayerDoc,
  PlayerId,
  PlayerLevel,
  PlayerPlaytime,
  PlayerUsername,
  ServerStatus,
  CacheService,
  R6Service,
  IGetRanks,
  IGetStats,
  Platform,
  PlatformAll,
  PlatformAllExtended
}