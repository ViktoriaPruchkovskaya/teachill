import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';
import { RoleType } from '../services/users';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  fullName: string;
  role: string | null;
}

export interface RawUser {
  id: number;
  username: string;
  fullName: string;
  role: RoleType;
}

export async function getUsers(): Promise<User[]> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.any(sql`
      SELECT users.id, users.username, users.password_hash, users.full_name, roles.name AS role
      FROM users
      LEFT JOIN user_roles on users.id = user_roles.user_id
      LEFT JOIN  roles  on user_roles.role_id = roles.id
      `);
    return rows.map(row => ({
      id: row.id as number,
      username: row.username as string,
      passwordHash: row.password_hash as string,
      fullName: row.full_name as string,
      role: row.role as string | null,
    }));
  });
}

export async function createUser(
  username: string,
  passwordHash: string,
  fullName: string
): Promise<number> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.one(sql`
    INSERT INTO users (username, password_hash, full_name) VALUES (${username}, ${passwordHash}, ${fullName}) 
    RETURNING id
    `);
    return row.id as number;
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
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
    SELECT users.id, users.username, users.password_hash, users.full_name, roles.name AS role
    FROM users
    LEFT JOIN user_roles on users.id = user_roles.user_id
    LEFT JOIN roles on user_roles.role_id = roles.id
    WHERE users.username = ${username}`);
    if (row) {
      return {
        id: row.id as number,
        username: row.username as string,
        passwordHash: row.password_hash as string,
        fullName: row.full_name as string,
        role: row.role as string | null,
      };
    }
    return null;
  });
}

export async function getUserById(id: number): Promise<User | null> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
    SELECT users.id, users.username, users.password_hash, users.full_name, roles.name AS role
    FROM users
    LEFT JOIN user_roles on users.id = user_roles.user_id
    LEFT JOIN roles on user_roles.role_id = roles.id
    WHERE users.id = ${id}`);
    if (row) {
      return {
        id: row.id as number,
        username: row.username as string,
        passwordHash: row.password_hash as string,
        fullName: row.full_name as string,
        role: row.role as string | null,
      };
    }
    return null;
  });
}

export async function changePassword(username: string, passwordHash: string): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
    UPDATE users
    SET password_hash = ${passwordHash}
    WHERE username = ${username}`);
  });
}

export async function changeRole(userId: number, roleType: number) {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
    UPDATE user_roles
    SET role_id = ${roleType}
    WHERE user_id = ${userId}`);
  });
}

export async function updateUser(username: string, user: RawUser) {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
    UPDATE users
    SET full_name = ${user.fullName}
    WHERE username = ${username}`);
  });
}

export async function deleteById(userId: number): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.transaction(async transaction => {
      await Promise.all([
        transaction.query(sql`
        DELETE
        FROM user_groups
        WHERE user_id = ${userId}`),
        transaction.query(sql`
        DELETE
        FROM user_roles
        WHERE user_id = ${userId}`),
      ]);

      await transaction.query(sql`
      DELETE
      FROM users
      WHERE id = ${userId}`);
    });
  });
}
