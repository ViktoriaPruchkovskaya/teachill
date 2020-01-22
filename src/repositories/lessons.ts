import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export async function createLesson(
  name: string,
  typeId: number,
  location: number,
  startTime: string,
  duration: number,
  description?: string
) {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    if (description) {
      await connection.query(
        sql`INSERT INTO lessons (name, type_id, description, location, start_time, duration)
      VALUES (${name}, ${typeId},${description}, ${location}, ${startTime}, ${duration})`
      );
    } else {
      await connection.query(
        sql`INSERT INTO lessons (name, type_id, location, start_time, duration)
    VALUES (${name}, ${typeId}, ${location}, ${startTime}, ${duration})`
      );
    }
  });
}
