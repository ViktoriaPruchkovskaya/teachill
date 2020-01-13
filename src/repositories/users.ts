import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface User {
  username: string;
  passwordHash: string;
  fullName: string;
}

export async function createUser(username: string, passwordHash: string, fullName: string) {
  await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO users (username, password_hash, full_name) VALUES (${username}, ${passwordHash}, ${fullName})`
    );
  });
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const res = await connection.maybeOne(sql`
    SELECT *
    FROM users
    WHERE username = ${username}`);
    if (res) {
      const user: User = {
        username: res.username as string,
        passwordHash: res.password_hash as string,
        fullName: res.full_name as string,
      };
      return user;
    }
    return null;
  });
}
