import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';
import { toDateFromUnix } from '../utils/date';
import { DBGroup } from './groups';

export interface RawLesson {
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  description?: string;
}

export interface DBLesson {
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
  return DatabaseConnection.getConnectionPool().connect(async connection => {
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
      startTime: toDateFromUnix(row.start_time as number),
      duration: row.duration as number,
      description: row.description as string,
    };
  });
}

export async function getLessonTypes(): Promise<LessonType[]> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.any(sql`SELECT id, name FROM lesson_types`);
    return rows.map(type => ({
      id: type.id as number,
      name: type.name as string,
    }));
  });
}

export async function createGroupLesson(
  lesson: DBLesson,
  group: DBGroup,
  subgroup: number = null
): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO lesson_groups (lesson_id, group_id, subgroup) VALUES (${lesson.id}, ${group.id}, ${subgroup})`
    );
  });
}

export async function getGroupLessons(groupId: number) {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    let groupLessons: DBLesson[];
    await connection.transaction(async transaction => {
      const rows = await transaction.any(sql`
        SELECT lessons.id, lessons.name, lessons.description, lessons.type_id, lessons.location,
        lessons.start_time, lessons.duration 
        FROM lessons
        JOIN lesson_groups on lessons.id = lesson_groups.lesson_id
        WHERE lesson_groups.group_id = ${groupId}
        `);

      const lessonIds = rows.map(row => Number(row.id));

      const teachers = await transaction.any(sql`
          SELECT full_name, lesson_id
          FROM lesson_teachers
          JOIN teachers on lesson_teachers.teacher_id = teachers.id
          WHERE lesson_id IN (${sql.join(lessonIds, sql`,`)})`);

      const lessonsMap = new Map<number, DBLesson>();
      rows.map(row =>
        lessonsMap.set(Number(row.id), {
          id: row.id as number,
          name: row.name as string,
          typeId: row.type_id as number,
          location: row.location as string,
          startTime: toDateFromUnix(row.start_time as number),
          duration: row.duration as number,
          description: row.description as string,
          teacher: [],
        })
      );

      groupLessons = teachers.map(teacher => {
        const lesson = lessonsMap.get(teacher.lesson_id as number);
        lesson.teacher.push({ fullName: teacher.full_name as string });
        return lesson;
      });
    });

    return groupLessons;
  });
}

export async function getGroupLessonById(
  groupId: number,
  lessonId: number
): Promise<number | null> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
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

export async function getLessonById(lessonId: number): Promise<DBLesson> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    let lesson: DBLesson;
    await connection.transaction(async transaction => {
      const row = await transaction.maybeOne(sql`
      SELECT id, name, description, type_id, location, start_time, duration 
      FROM lessons
      WHERE id = ${lessonId}
      `);
      if (!row) {
        lesson = null;
      }

      const teachers = await transaction.any(sql`
        SELECT full_name
        FROM lesson_teachers
        JOIN teachers on lesson_teachers.teacher_id = teachers.id 
        WHERE lesson_id = ${row.id}
        `);

      lesson = {
        id: row.id as number,
        name: row.name as string,
        typeId: row.type_id as number,
        location: row.location as string,
        startTime: toDateFromUnix(row.start_time as number),
        duration: row.duration as number,
        description: row.description as string,
        teacher: teachers.map(teacher => ({ fullName: teacher.full_name as string })),
      };
    });
    return lesson;
  });
}

export async function deleteGroupLessonsById(groupId: number): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
      DELETE 
      FROM lesson_groups
      WHERE group_id = ${groupId}`);
  });
}

export async function removeAllGroupLessons(): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.transaction(async transaction => {
      await transaction.query(sql`DELETE FROM lesson_groups`);
      await transaction.query(sql`DELETE FROM lesson_teachers`);
      await transaction.query(sql`DELETE FROM group_lesson_attachments`);
      await transaction.query(sql`DELETE FROM lessons`);
    });
  });
}

export async function assignTeacherToLesson(lessonId: number, teacherId: number): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO lesson_teachers (lesson_id, teacher_id) VALUES (${lessonId}, ${teacherId})`
    );
  });
}
