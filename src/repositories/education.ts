import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface Group {
  id: number;
  name: string;
}

export async function createGroup(id: number, name: string): Promise<number> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.one(
      sql`INSERT INTO groups (id, name) VALUES (${id}, ${name}) RETURNING id`
    );
    return row.id as number;
  });
}

export async function getGroups(): Promise<string[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    return await connection.many(sql`SELECT * FROM groups`);
  });
}

export async function createGroupMember(userId: number, groupId: number): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO user_groups (user_id, group_id) VALUES (${userId}, ${groupId})`
    );
  });
}

export async function getGroupMembers(groupId: number): Promise<string[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    return await connection.many(sql`
    SELECT users.username, users.full_name, roles.name as role
    FROM users
    JOIN user_groups on users.id = user_groups.user_id
    JOIN groups on user_groups.group_id = groups.id
    JOIN user_roles on users.id = user_roles.user_id
    JOIN roles on user_roles.role_id = roles.id
    WHERE group_id = ${groupId};`);
  });
}

export async function getGroupById(id: number): Promise<Group | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const res = await connection.maybeOne(sql`
    SELECT *
    FROM groups
    WHERE id = ${id}`);
    if (res) {
      const group: Group = {
        id: res.id as number,
        name: res.name as string,
      };
      return group;
    }
    return null;
  });
}

export async function getMembershipByUserId(id: number): Promise<number | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
    SELECT *
    FROM user_groups
    JOIN groups on user_groups.group_id = groups.id
    WHERE user_id = ${id}`);
    if (row) {
      return row.group_id as number;
    }
    return null;
  });
}
