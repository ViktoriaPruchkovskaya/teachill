import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface RecievedLesson {
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

interface GroupLesson {
  lessonId: number;
}

export async function createLesson(obj: RecievedLesson): Promise<RecievedLesson> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    obj.description = obj.description || '';
    const row = await connection.one(sql`
      INSERT INTO lessons (name, type_id, description, location, start_time, duration)
      VALUES (${obj.name}, ${obj.typeId},${obj.description}, ${obj.location}, ${obj.startTime}, ${obj.duration}) 
      RETURNING name, type_id, description, location, start_time, duration`);
    const lesson: RecievedLesson = {
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

export async function createGroupLesson(lessonId: number, groupId: number): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO lesson_groups (lesson_id, group_id) VALUES (${lessonId}, ${groupId})`
    );
  });
}

export async function getGroupLessons(groupId: number): Promise<RecievedLesson[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.many(sql`
      SELECT lessons.name, lessons.description, lessons.type_id, lessons.location, lessons.start_time, lessons.duration 
      FROM lessons
      JOIN lesson_groups on lessons.id = lesson_groups.lesson_id
      WHERE lesson_groups.group_id = ${groupId}
    `);
    const groupLessons: RecievedLesson[] = rows.map(lesson => {
      const res: RecievedLesson = {
        name: lesson.name as string,
        typeId: lesson.type_id as number,
        location: lesson.location as number,
        startTime: lesson.start_time as string,
        duration: lesson.duration as number,
        description: lesson.description as string,
      };
      return res;
    });
    return groupLessons;
  });
}

export async function getGroupLessonsById(groupId: number): Promise<GroupLesson | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
      SELECT lesson_id 
      FROM lesson_groups
      WHERE group_id = ${groupId}`);
    if (row) {
      const lesson: GroupLesson = {
        lessonId: row.lesson_id as number,
      };
      return lesson;
    }
    return null;
  });
}
