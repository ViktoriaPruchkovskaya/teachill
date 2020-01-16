import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export async function createGroup(id: number, name: string): Promise<number> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.one(
      sql`INSERT INTO groups (id, name) VALUES (${id}, ${name}) RETURNING id`
    );
    return row.id as number;
  });
}
