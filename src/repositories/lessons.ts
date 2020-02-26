import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface RawLesson {
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  description?: string;
}

interface DBLesson {
  id: number;
  name: string;
  typeId: number;
  location: string;
  startTime: Date;
  duration: number;
  description?: string;
  teacher?: Teacher[];
}

interface LessonType {
  id: number;
  name: string;
}

interface Teacher {
  fullName: string;
}

export async function createLesson(obj: RawLesson): Promise<DBLesson> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    obj.description = obj.description || '';
    const row = await connection.one(sql`
      INSERT INTO lessons (name, type_id, description, location, start_time, duration)
      VALUES (${obj.name}, ${obj.typeId},${obj.description}, ${obj.location}, ${obj.startTime}, ${obj.duration}) 
      RETURNING id, name, type_id, description, location, start_time, duration`);
    return {
      id: row.id as number,
      name: row.name as string,
      typeId: row.type_id as number,
      location: row.location as string,
      startTime: new Date(row.start_time as number),
      duration: row.duration as number,
      description: row.description as string,
    };
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

export async function getGroupLessons(groupId: number): Promise<DBLesson[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    let groupLessons: DBLesson[];
    await connection.transaction(async transaction => {
      const rows = await transaction.many(sql`
      SELECT lessons.id, lessons.name, lessons.description, lessons.type_id, lessons.location,
      lessons.start_time, lessons.duration 
      FROM lessons
      JOIN lesson_groups on lessons.id = lesson_groups.lesson_id
      WHERE lesson_groups.group_id = ${groupId}
      `);

      const teachers = await Promise.all(
        rows.map(
          async lesson =>
            await transaction.many(sql`
            SELECT full_name
            FROM lesson_teachers
            JOIN teachers on lesson_teachers.teacher_id = teachers.id 
            WHERE lesson_id = ${lesson.id}`)
        )
      );

      groupLessons = rows.map((lesson, index) => ({
        id: lesson.id as number,
        name: lesson.name as string,
        typeId: lesson.type_id as number,
        location: lesson.location as string,
        startTime: new Date(lesson.start_time as number),
        duration: lesson.duration as number,
        description: lesson.description as string,
        teacher: teachers[index].map(t => ({
          fullName: t.full_name as string,
        })),
      }));
    });

    return groupLessons;
  });
}

export async function getGroupLessonById(
  groupId: number,
  lessonId: number
): Promise<number | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
    SELECT group_id, lesson_id
    FROM lesson_groups
    WHERE group_id = ${groupId} AND lesson_id = ${lessonId}`);
    if (row) {
      return row.lesson_id as number;
    }
    return null;
  });
}

export async function getLessonById(lessonId: number): Promise<number | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`SELECT id FROM lessons WHERE id = ${lessonId}`);
    if (row) {
      return row.id as number;
    }
    return null;
  });
}

export async function deleteAllGroupLessons(groupId: number): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
      DELETE 
      FROM lesson_groups
      WHERE group_id = ${groupId}`);
  });
}

export async function assignTeacherToLesson(lessonId: number, teacherId: number): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO lesson_teachers (lesson_id, teacher_id) VALUES (${lessonId}, ${teacherId})`
    );
  });
}
