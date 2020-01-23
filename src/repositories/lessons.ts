import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface CreatedLesson {
  name: string;
  type: string | number;
  location: number;
  startTime: string;
  duration: number;
  description?: string;
}

export async function createLesson(obj: CreatedLesson): Promise<CreatedLesson> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    obj.description = obj.description || '';
    const row = await connection.one(sql`
      INSERT INTO lessons (name, type_id, description, location, start_time, duration)
      VALUES (${obj.name}, ${obj.type},${obj.description}, ${obj.location}, ${obj.startTime}, ${obj.duration}) 
      RETURNING id`);
    const rows = await connection.one(sql`
      SELECT lessons.name, lessons.location, lessons.start_time, lessons.duration, lessons.description, lesson_types.name as type
      FROM lessons
      JOIN lesson_types on lessons.type_id = lesson_types.id
      WHERE lessons.id = ${row.id}`);

    const lesson: CreatedLesson = {
      name: rows.name as string,
      type: rows.type as string,
      location: rows.location as number,
      startTime: rows.start_time as string,
      duration: rows.duration as number,
      description: rows.description as string,
    };
    return lesson;
  });
}
