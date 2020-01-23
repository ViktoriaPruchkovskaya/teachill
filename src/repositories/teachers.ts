import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export interface Teacher {
  id: number;
  fullName: string;
}

export async function createTeacher(fullName: string): Promise<Teacher> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.one(
      sql`INSERT INTO teachers (full_name) VALUES (${fullName}) RETURNING id, full_name`
    );
    const teacher: Teacher = {
      id: rows.id as number,
      fullName: rows['full_name'] as string,
    };
    return teacher;
  });
}

export async function getTeachers(): Promise<Teacher[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.many(sql`SELECT id, full_name FROM teachers`);
    const teachers: Teacher[] = rows.map(teacher => {
      const res: Teacher = {
        id: teacher.id as number,
        fullName: teacher.full_name as string,
      };
      return res;
    });
    return teachers;
  });
}
