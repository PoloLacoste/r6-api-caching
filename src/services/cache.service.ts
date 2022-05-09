import { createClient } from 'redis';

const EXPIRATION = 'expiration';
const ID = 'id';


export class CacheService {

  private client: any;

  private online = true;

  constructor(
    private readonly url: string
  ) {
    this.client = createClient({
      url: this.url,
    });
  }

  public async init(): Promise<void> {
    await this.client.connect();

    this.client.on('error', (error) => {
      this.online = false;
      this.client.quit();
      console.log(`Redis: ${error}`);
    });
  }

  isOnline(): boolean {
    return this.online;
  }

  async getExpiration(id: string): Promise<number | null> {
    try {
      const result = await this.client.get(`${EXPIRATION}-${id}`);
      return result != null ? parseInt(result) : null;
    }
    catch(e) {
      console.log(e);
    }

    return null;
  }

  async setExpiration(id: string, timestamp: number): Promise<void> {
    try {
      await this.client.set(`${EXPIRATION}-${id}`, timestamp);
    }
    catch(e) {
      console.log(e);
    }
  }

  async getId(username: string): Promise<string> {
    try {
      return await this.client.get(`${ID}-${username}`) as string;
    }
    catch(e) {
      console.log(e);
    }

    return null;
  }

  async setId(username: string, id: string): Promise<void> {
    try {
      await await this.client.set(`${ID}-${username}`, id);
    }
    catch(e) {
      console.log(e);
    }
  }
}