import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export async function createUser(username: string, passwordHash: string, fullName: string) {
  await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO users (username, password_hash, full_name) VALUES (${username}, ${passwordHash}, ${fullName})`
    );
  });
}
