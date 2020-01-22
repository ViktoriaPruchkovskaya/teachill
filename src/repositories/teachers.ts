import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export interface Teacher {
  id: number;
  fullName: string;
}

export async function createTeacher(fullName: string): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`INSERT INTO teachers (full_name) VALUES (${fullName})`);
  });
}

export async function getTeachers(): Promise<Teacher[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    let teachers: Teacher[];
    teachers = await connection.many(sql`SELECT id, full_name FROM teachers`);
    teachers = teachers.map(teacher => {
      const res: Teacher = {
        id: teacher.id,
        fullName: teacher['full_name'],
      };
      return res;
    });
    return teachers;
  });
}
