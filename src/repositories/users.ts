import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export interface User {
  username: string;
  passwordHash: string;
  fullName: string;
  role: string | null;
  token: string | null;
}

export async function createUser(
  username: string,
  passwordHash: string,
  fullName: string
): Promise<number> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.one(
      sql`INSERT INTO users (username, password_hash, full_name) VALUES (${username}, ${passwordHash}, ${fullName}) RETURNING id`
    );
    return rows.id as number;
  });
}

export async function createUserRole(userId: number, roleType: number): Promise<void> {
  await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO user_roles (user_id, role_id) VALUES (${userId}, ${roleType})`
    );
  });
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const res = await connection.maybeOne(sql`
    SELECT users.username, users.password_hash, users.full_name, roles.name AS role
    FROM users
    INNER JOIN user_roles on users.id = user_roles.user_id
    INNER JOIN roles on user_roles.role_id = roles.id
    WHERE users.username = ${username}`);
    if (res) {
      const user: User = {
        username: res.username as string,
        passwordHash: res.password_hash as string,
        fullName: res.full_name as string,
        role: res.role as string | null,
        token: null,
      };
      return user;
    }
    return null;
  });
}
