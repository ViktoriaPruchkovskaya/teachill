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

  public static initConnection(DatabaseConfiguration: {
    host: string;
    port: string;
    password: string;
    user: string;
    database: string;
  }) {
    this.connectionPool = createPool(
      `postgresql://${DatabaseConfiguration.user}:${DatabaseConfiguration.password}@${DatabaseConfiguration.host}:${DatabaseConfiguration.port}/${DatabaseConfiguration.database}`
    );
  }

  public static getConnectionPool() {
    return this.connectionPool;
  }
}
