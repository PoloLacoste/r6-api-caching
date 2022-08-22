import R6API from 'r6api.js';
import { IGetRanks } from 'r6api.js/dist/methods/getRanks';
import { IGetStats } from 'r6api.js/dist/methods/getStats';
import { Platform, PlatformAll } from 'r6api.js/dist/typings';

import { CacheService } from './cache.service';
import { Database, R6Collection } from '../databases/database';

import { PlayerLevel } from '../models/player-level';
import { PlayerPlaytime } from '../models/player-playtime';
import { PlayerUsername } from '../models/player-username';
import { ServerStatus } from '../models/server-status';
import { PlayerDoc } from '../models/player-doc';
export interface R6ServiceOptions {
  caching?: boolean,
  expiration?: number,
  cacheService?: CacheService,
  database?: Database
}

export class R6Service {

  private caching = false;
  private expiration = 60 * 1000; // 1 minute
  private cacheService: CacheService;
  private database: Database;
  private readonly r6Api: R6API;

  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly options?: R6ServiceOptions
  ) {
    this.setOptions();

    this.r6Api = new R6API({
      email: this.email,
      password: this.password
    });
  }

  private setOptions() {
    if (this.options?.caching != null) {
      this.caching = this.options.caching;
    }

    if (this.options?.expiration != null) {
      this.expiration = this.options.expiration;
    }

    if (this.options?.cacheService != null) {
      this.cacheService = this.options.cacheService;
    }

    if (this.options?.database != null) {
      this.database = this.options.database;
    }
  }

  public async init() {
    if (this.caching) {
      await this.database?.init();
      await this.cacheService?.init();
    }
  }

  private async getCachedData(id: string, collection: R6Collection,
    getData: () => Promise<any | null>): Promise<any | null> {

    if (!this.caching || !this.cacheService.isOnline() ||
      !this.database.isOnline()) {
      return await getData();
    }

    // create a cache id for each collection of each player
    const cacheId = `${id}_${collection}`;
    const now = new Date().getTime();
    let cachedTimestamp = await this.cacheService.getExpiration(cacheId) ?? -1;
    const notExpired = cachedTimestamp + this.expiration > now;

    if (notExpired) {
      const result = await this.database.get(collection, id);
      if (result != null) {
        return result;
      }
      cachedTimestamp = -1;
    }

    // caching if data is expired or not in the database
    let data = await getData();
    if (!data) {
      return data;
    }
    if (cachedTimestamp == -1) {
      await this.database.insert(collection, data);
    } else {
      await this.database.update(collection, id, data);
    }
    await this.cacheService.setExpiration(cacheId, now);
    return data;
  }

  private async getFirstResult<T>(getData: () => Promise<any | null>): Promise<T> {
    try {
      const result = await getData();
      return result.length > 0 ? result[0] : null;
    }
    catch (e) {
      return null;
    }
  }

  async getId(platform: PlatformAll, username: string): Promise<string | null> {
    const getId = (): Promise<string | null> => this.r6Api.findByUsername(platform, username).then(el => el[0]?.id);
    if (!this.caching || !this.cacheService.isOnline()) {
      return await getId();
    }

    const platformUsername = `${platform}/${username}`;
    const cachedId = await this.cacheService.getId(platformUsername);
    if (cachedId != null) {
      return cachedId;
    }
    const id = await getId();
    await this.cacheService.setId(platformUsername, id);
    return id;
  }

  async getUsername(platform: PlatformAll, id: string): Promise<PlayerUsername | null> {
    return await this.getCachedData(id, R6Collection.username, async () => {
      return this.getFirstResult(() => this.r6Api.findById(platform, id));
    });
  }

  async getLevelById(platform: Platform, id: string): Promise<PlayerLevel | null> {
    return await this.getCachedData(id, R6Collection.level, async () => {
      return this.getFirstResult(() => this.r6Api.getProgression(platform, id));
    });
  }

  async getLevelByUsername(platform: Platform, username: string): Promise<PlayerLevel | null> {
    const id = await this.getId(platform, username);
    return await this.getLevelById(platform, id);
  }

  async getPlaytimeById(platform: Platform, id: string): Promise<PlayerPlaytime | null> {
    return await this.getCachedData(id, R6Collection.playtime, async () => {
      return this.getFirstResult(() => this.r6Api.getPlaytime(platform, id));
    });
  }

  async getPlaytimeByUsername(platform: Platform, username: string): Promise<PlayerPlaytime | null> {
    const id = await this.getId(platform, username);
    return await this.getPlaytimeById(platform, id);
  }

  async getRankById(platform: Platform, id: string): Promise<IGetRanks | null> {
    return await this.getCachedData(id, R6Collection.rank, async () => {
      return this.getFirstResult(() => this.r6Api.getRanks(platform, id, {
        seasonIds: 'all',
        boardIds: 'pvp_ranked',
        regionIds: 'all',
      }));
    });
  }

  async getRankByUsername(platform: Platform, username: string): Promise<IGetRanks | null> {
    const id = await this.getId(platform, username);
    return await this.getRankById(platform, id);
  }

  async getStatsById(platform: Platform, id: string): Promise<IGetStats | null> {
    return await this.getCachedData(id, R6Collection.stats, async () => {
      try {
        const result = await this.r6Api.getStats(platform, id);
        if (result) {
          return result[0];
        }
      }
      catch (e) { }
      return null;
    });
  }

  async getStatsByUsername(platform: Platform, username: string): Promise<IGetStats | null> {
    const id = await this.getId(platform, username);
    return await this.getStatsById(platform, id);
  }

  async getServersStatus(): Promise<ServerStatus[] | null> {
    try {
      return await this.r6Api.getStatus();
    }
    catch (e) {
      return null;
    }
  }

  async getAll(platform: Platform, username: string): Promise<PlayerDoc | null> {
    const id = await this.getId(platform, username);

    const result = await Promise.all([
      this.getLevelById(platform, id),
      this.getPlaytimeById(platform, id),
      this.getRankById(platform, id),
      this.getStatsById(platform, id),
      this.getUsername(platform, id),
    ]);

    if (result.every((val) => val != null)) {
      return {
        player: username,
        level: result[0],
        playtime: result[1],
        rank: result[2],
        stats: result[3],
        username: result[4],
      }
    }

    return null;
  }

  async close(): Promise<void> {
    await this.database?.init();
    await this.cacheService?.init();
  }
}
