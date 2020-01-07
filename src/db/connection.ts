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
    // TODO: create interface DatabaseConfiguration that will have user password host etc info for connecting to database.
    // Pass object with this interface type to this method instead of using env variables in this method.
    // This object should be populated in index.ts
    this.connectionPool = createPool(
      `postgresql://${DatabaseConfiguration.user}:${DatabaseConfiguration.password}@${DatabaseConfiguration.host}:${DatabaseConfiguration.port}/${DatabaseConfiguration.database}`
    );
  }

  public static getConnectionPool() {
    return this.connectionPool;
  }
}
