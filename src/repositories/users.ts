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

export async function findUserAccount(recievedUsername: string) {
  await DatabaseConnection.getConnectionPool().connect(async connection => {
    const res = await connection.maybeOne(sql`
    SELECT *
    FROM users
    WHERE username = ${recievedUsername}`);
    if (res) {
      const user: User = {
        username: res.username as string,
        passwordHash: res.password_hash as string,
        fullName: res.full_name as string,
      };
      return user;
    } else return null;
  });
}
