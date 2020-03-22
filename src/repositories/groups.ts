import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export interface DBGroup {
  id: number;
  name: string;
}

export interface GroupMember {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

export async function createGroup(name: string): Promise<number> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.one(sql`INSERT INTO groups (name) VALUES (${name}) RETURNING id`);
    return row.id as number;
  });
}

export async function getGroups(): Promise<DBGroup[]> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.any(sql`SELECT id, name FROM groups`);
    return rows.map(group => ({
      id: group.id as number,
      name: group.name as string,
    }));
  });
}

export async function createGroupMember(userId: number, groupId: number): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO user_groups (user_id, group_id) VALUES (${userId}, ${groupId})`
    );
  });
}

export async function getGroupMembers(groupId: number): Promise<GroupMember[]> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.any(sql`
      SELECT users.id, users.username, users.full_name, roles.name as role
      FROM users
      JOIN user_groups on users.id = user_groups.user_id
      JOIN groups on user_groups.group_id = groups.id
      JOIN user_roles on users.id = user_roles.user_id
      JOIN roles on user_roles.role_id = roles.id
      WHERE group_id = ${groupId};`);

    return rows.map(groupMember => ({
      id: groupMember.id as number,
      username: groupMember.username as string,
      fullName: groupMember.full_name as string,
      role: groupMember.role as string,
    }));
  });
}

export async function getGroupById(id: number): Promise<DBGroup | null> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const res = await connection.maybeOne(sql`
      SELECT id, name
      FROM groups
      WHERE id = ${id}`);
    if (res) {
      return {
        id: res.id as number,
        name: res.name as string,
      };
    }
    return null;
  });
}

export async function getGroupByName(name: string): Promise<DBGroup | null> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const res = await connection.maybeOne(sql`
      SELECT id, name
      FROM groups
      WHERE name = ${name}`);
    if (res) {
      return {
        id: res.id as number,
        name: res.name as string,
      };
    }
    return null;
  });
}

export async function getMembershipByUserId(id: number): Promise<string | null> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
      SELECT user_id, group_id
      FROM user_groups
      WHERE user_id = ${userId} AND group_id = ${groupId}`);
    if (row) {
      return row.group_id as number;
    }
    return null;
  });
}
