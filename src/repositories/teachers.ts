import { DatabaseConnection } from '../db/connection';
import { sql, NotFoundError } from 'slonik';

export interface Teacher {
  id: number;
  fullName: string;
}

export async function createTeacher(fullName: string): Promise<Teacher> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.one(
      sql`INSERT INTO teachers (full_name) VALUES (${fullName}) RETURNING id, full_name`
    );

    return { id: rows.id as number, fullName: rows.full_name as string };
  });
}

export async function getTeachers(): Promise<Teacher[] | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    let rows;
    try {
      rows = await connection.many(sql`SELECT id, full_name FROM teachers`);
    } catch (err) {
      if (err instanceof NotFoundError) {
        return null;
      }
    }

    return rows.map(teacher => ({
      id: teacher.id as number,
      fullName: teacher.full_name as string,
    }));
  });
}

export async function getTeacherById(id: number): Promise<Teacher | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
    SELECT id, full_name 
    FROM teachers 
    WHERE id = ${id}`);
    if (row) {
      return { id: row.id as number, fullName: row.full_name as string };
    }
    return null;
  });
}

export async function getTeacherByFullName(fullName: string): Promise<Teacher | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
    SELECT id, full_name 
    FROM teachers 
    WHERE full_name = ${fullName}`);
    if (row) {
      return { id: row.id as number, fullName: row.full_name as string };
    }
    return null;
  });
}
