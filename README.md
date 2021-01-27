# r6-api-caching

Simple cacher around [r6api.js](https://github.com/danielwerg/r6api.js) using redis and mongodb.

[![NPM](https://nodei.co/npm/r6-api-caching.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/r6-api-caching/)

## Install

```bash
npm install r6-api-caching
```

## Setup

```typescript
import { R6Service } from 'r6-api-caching';

const r6Service = new R6Service('email', 'password');

const platform = 'uplay';
const username = 'Godly';

const id = await r6Service.getId(platform, username);
console.log(`Player id : ${id}`);
```

```
Player id : be3313d6-d443-4eae-818f-bb7f56837781
```

## With Redis & Mongodb

```typescript
import { R6Service, CacheService, MongoDatabase } from 'r6-api-caching';

const r6Service = new R6Service('email', 'password', {
  caching: true,
  expiration: 10 * 60 * 1000 // 10 minutes (default is 1 minute)
  cacheService: new CacheService(
    "redis://localhost:6379"
  ),
  database: new MongoDatabase(
    "mongodb://root:password@localhost:27017"
  )
});

const platform = 'uplay';
const username = 'Godly';

const id = await r6Service.getId(platform, username);
console.log(`Player id : ${id}`);
```

```
Player id : be3313d6-d443-4eae-818f-bb7f56837781
```
