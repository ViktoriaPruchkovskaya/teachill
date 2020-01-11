import { createPool, DatabasePoolType } from 'slonik';

export interface DatabaseConfiguration {
  host: string;
  port: string;
  password: string;
  user: string;
  database: string;
}

export class DatabaseConnection {
  private static connectionPool: DatabasePoolType = null;

  public static initConnection(dbConfig: DatabaseConfiguration) {
    this.connectionPool = createPool(
      `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    );
  }

  public static getConnectionPool() {
    return this.connectionPool;
  }
}
