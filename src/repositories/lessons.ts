import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface CreatedLesson {
  name: string;
  typeId: number;
  location: number;
  startTime: string;
  duration: number;
  description?: string;
}

interface LessonType {
  id: number;
  name: string;
}

export async function createLesson(obj: CreatedLesson): Promise<CreatedLesson> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    obj.description = obj.description || '';
    const row = await connection.one(sql`
      INSERT INTO lessons (name, type_id, description, location, start_time, duration)
      VALUES (${obj.name}, ${obj.typeId},${obj.description}, ${obj.location}, ${obj.startTime}, ${obj.duration}) 
      RETURNING name, type_id, description, location, start_time, duration`);
    const lesson: CreatedLesson = {
      name: row.name as string,
      typeId: row.type_id as number,
      location: row.location as number,
      startTime: row.start_time as string,
      duration: row.duration as number,
      description: row.description as string,
    };
    return lesson;
  });
}

export async function getLessonTypes(): Promise<LessonType[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.many(sql`SELECT id, name FROM lesson_types`);
    const lessonTypes: LessonType[] = rows.map(type => {
      const res: LessonType = {
        id: type.id as number,
        name: type.name as string,
      };
      return res;
    });
    return lessonTypes;
  });
}
