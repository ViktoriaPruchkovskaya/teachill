import { Db, MongoClient } from 'mongodb';

export interface MongoConfiguration {
  host: string;
  port: string;
  password: string;
  username: string;
  database: string;
}

export class MongoConnection {
  private static client: MongoClient = null;

  public static async initConnection(config: MongoConfiguration): Promise<void> {
    this.client = await MongoClient.connect(
      `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`,
      { useUnifiedTopology: true }
    );
  }

  public static getDb(): Db {
    return this.client.db();
  }
}
