require('dotenv').config();

import { R6Service } from '../../src';
import * as constants from '../constants';

describe('R6 service', () => {
    let email: string;
    let password: string;
    let service: R6Service;

    beforeAll(() => {
        email = process.env.EMAIL;
        password = process.env.PASSWORD;
    });

    beforeEach(() => {
        service = new R6Service(email, password, {
            caching: false,
        });
    });

    it('get id', async () => {
        const result = await service.getId(constants.platform, constants.username);
        expect(result).toBe(constants.userId);
    });

    it('get username', async () => {
        const result = await service.getUsername(constants.platform, constants.userId);
        expect(result.username).toBe(constants.username);
    });

    it('get level by id', async () => {
        const result = await service.getLevelById(constants.platform, constants.userId);
        expect(result.id).toBe(constants.userId);
        expect(result.xp).toBeGreaterThan(0);
    });

    it('get level by username', async () => {
        const result = await service.getLevelByUsername(constants.platform, constants.username);
        expect(result.id).toBe(constants.userId);
        expect(result.xp).toBeGreaterThan(0);
    });

    it('get playtime by id', async () => {
        const result = await service.getPlaytimeById(constants.platform, constants.userId);
        expect(result.id).toBe(constants.userId);
        expect(result.pvp.ranked).toBeGreaterThan(0);
    });

    it('get playtime by username', async () => {
        const result = await service.getPlaytimeByUsername(constants.platform, constants.username);
        expect(result.id).toBe(constants.userId);
        expect(result.pvp.ranked).toBeGreaterThan(0);
    });

    it('get rank by id', async () => {
        const result = await service.getRankById(constants.platform, constants.userId);
        expect(result.id).toBe(constants.userId);
        expect(result.seasons[24].seasonName).toBe(constants.seasonName);
        expect(result.seasons[24].regions.emea.boards.pvp_ranked.current.mmr).toBe(constants.seasonCurrentMMR);
        expect(result.seasons[24].regions.emea.boards.pvp_ranked.kills).toBe(constants.seasonKills);
    }, 15000);

    it('get rank by username', async () => {
        const result = await service.getRankByUsername(constants.platform, constants.username);
        expect(result.id).toBe(constants.userId);
        expect(result.seasons[24].seasonName).toBe(constants.seasonName);
        expect(result.seasons[24].regions.emea.boards.pvp_ranked.current.mmr).toBe(constants.seasonCurrentMMR);
        expect(result.seasons[24].regions.emea.boards.pvp_ranked.kills).toBe(constants.seasonKills);
    }, 15000);

    it('get stats by id', async () => {
        const result = await service.getStatsById(constants.platform, constants.userId);
        expect(result.id).toBe(constants.userId);
    }, 20000);

    it('get stats by username', async () => {
        const result = await service.getStatsByUsername(constants.platform, constants.username);
        expect(result.id).toBe(constants.userId);
    }, 20000);

    it('get server status', async () => {
        const result = await service.getServersStatus();
        expect(result).toBeInstanceOf(Array);
    });

    it('get all', async () => {
        const result = await service.getAll(constants.platform, constants.username);
        expect(result.username.username).toBe(constants.username);
    }, 20000);

    afterEach(async () => {
        await service.close();
    });
});