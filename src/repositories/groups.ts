import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export interface Group {
  id: number;
  name: string;
}

export interface GroupMember {
  username: string;
  fullName: string;
  role: string;
}

export async function createGroup(id: number, name: string): Promise<number> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.one(
      sql`INSERT INTO groups (id, name) VALUES (${id}, ${name}) RETURNING id`
    );
    return row.id as number;
  });
}

export async function getGroups(): Promise<Group[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    let groups: Group[];
    groups = await connection.many(sql`SELECT id, name FROM groups`);
    groups = groups.map(group => {
      const res: Group = { id: group.id, name: group.name };
      return res;
    });

    return groups;
  });
}

export async function createGroupMember(userId: number, groupId: number): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO user_groups (user_id, group_id) VALUES (${userId}, ${groupId})`
    );
  });
}

export async function getGroupMembers(groupId: number): Promise<GroupMember[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    let groupMembers: GroupMember[];
    groupMembers = await connection.many(sql`
    SELECT users.username, users.full_name, roles.name as role
    FROM users
    JOIN user_groups on users.id = user_groups.user_id
    JOIN groups on user_groups.group_id = groups.id
    JOIN user_roles on users.id = user_roles.user_id
    JOIN roles on user_roles.role_id = roles.id
    WHERE group_id = ${groupId};`);

    groupMembers = groupMembers.map(groupMember => {
      const res: GroupMember = {
        username: groupMember.username,
        fullName: groupMember['full_name'],
        role: groupMember.role,
      };
      return res;
    });
    return groupMembers;
  });
}

export async function getGroupById(id: number): Promise<Group | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const res = await connection.maybeOne(sql`
    SELECT id, name
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
    SELECT user_id, group_id
    FROM user_groups
    JOIN groups on user_groups.group_id = groups.id
    WHERE user_id = ${id}`);
    if (row) {
      return row.group_id as number;
    }
    return null;
  });
}
