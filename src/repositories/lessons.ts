import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';
import { Lesson } from '../services/education';

export async function createLesson(obj: Lesson): Promise<Lesson> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    let rows;
    if (obj.description) {
      rows = await connection.one(sql`
        INSERT INTO lessons (name, type_id, description, location, start_time, duration)
        VALUES (${obj.name}, ${obj.typeId},${obj.description}, ${obj.location}, ${obj.startTime}, ${obj.duration}) 
        RETURNING name, type_id, description, location, start_time, duration`);
    } else {
      rows = await connection.one(sql`
        INSERT INTO lessons (name, type_id, location, start_time, duration)
        VALUES (${obj.name}, ${obj.typeId}, ${obj.location}, ${obj.startTime}, ${obj.duration})
        RETURNING name, type_id, location, start_time, duration`);
    }
    const lesson: Lesson = {
      name: rows.name as string,
      typeId: rows['type_id'] as number,
      location: rows.location as number,
      startTime: rows['start_time'] as string,
      duration: rows.duration as number,
      description: rows.description as string,
    };
    return lesson;
  });
}
