import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export async function createAttachment(name: string, url: string): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`INSERT INTO attachments (name, url) VALUES (${name}, ${url})`);
  });
}
