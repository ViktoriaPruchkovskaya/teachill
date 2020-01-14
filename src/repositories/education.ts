import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export async function createGroup(id: number, name: string): Promise<number> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const groupId = await connection.one(
      sql`INSERT INTO groups (id, name) VALUES (${id}, ${name}) RETURNING id`
    );
    return groupId.id as number;
  });
}
