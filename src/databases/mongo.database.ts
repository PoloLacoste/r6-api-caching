import { Collection, Db, MongoClient } from 'mongodb';

import { R6Class, Database, R6Collection } from './database';

export class MongoDatabase extends Database {

  private client: MongoClient;
  private db: Db;

  private readonly collections = ['level', 'playtime', 'rank', 'stats', 'username'];

  private online = true;

  constructor(
    private readonly url: string
  ) {
    super();
    this.init();
  }

  async init(): Promise<void> {
    try {
      this.client = await MongoClient.connect(this.url, {
        useUnifiedTopology: true,
        connectTimeoutMS: 4000,
      });

      this.initDb();
    }
    catch(e) {
      this.online = false;
      console.log(`Mongodb: ${e}`);
    }
  }

  private async initDb(): Promise<void> {
    this.db = this.client.db('r6');

    let indexes = [];
    
    for(let name of this.collections) {
      indexes.push(this.db.createIndex(name, 'id'));
    }

    await Promise.all(indexes);
  }

  private getCollection(name: R6Collection): Collection {
    return this.db.collection(name.toString());
  }

  async get(name: R6Collection, id: string): Promise<R6Class | null> {
    const data = await this.getCollection(name).findOne({
      id
    });
    delete data?._id;
    return data;
  }

  async insert(name: R6Collection, data: R6Class): Promise<void> {
    await this.getCollection(name).insertOne(data);
    const result = data as any;
    delete result._id;
  }

  async update(name: R6Collection, id: string, data: R6Class): Promise<void> {
    await this.getCollection(name).updateOne({
      _id: id
    }, {
      $set: {
        data
      }
    });
  }

  isOnline(): boolean {
    return this.online;
  }
}