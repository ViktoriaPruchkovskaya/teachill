import { createPool, DatabasePoolType } from 'slonik';

export class DatabaseConnection {
  private static connectionPool: DatabasePoolType = null;

  public static initConnection() {
    // TODO: create interface DatabaseConfiguration that will have user password host etc info for connecting to database.
    // Pass object with this interface type to this method instead of using env variables in this method.
    // This object should be populated in index.ts
    this.connectionPool = createPool(
      `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`
    );
  }

  public static getConnectionPool() {
    return this.connectionPool;
  }
}
