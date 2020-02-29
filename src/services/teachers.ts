import {
  createTeacher,
  getTeachers,
  getTeacherById,
  getTeacherByFullName,
} from '../repositories/teachers';
import { NotFoundError, ExistError } from '../errors';

interface Teacher {
  id: number;
  fullName: string;
}

export class TeacherService {
  public async createTeacher(fullName: string): Promise<Teacher> {
    const dbTeacher = await getTeacherByFullName(fullName);
    if (dbTeacher) {
      throw new ExistError('Teacher already exists');
    }
    const teacher = await createTeacher(fullName);
    return { id: teacher.id, fullName: teacher.fullName };
  }

  public async getTeachers(): Promise<Teacher[]> {
    const teachers = await getTeachers();
    if (!teachers) {
      throw new NotFoundError('Teachers do not exist');
    }
    return teachers.map(teacher => ({ id: teacher.id, fullName: teacher.fullName }));
  }

  public async getTeacherById(id: number): Promise<Teacher> {
    const teacher = await getTeacherById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher does not exist');
    }
    return { id: teacher.id, fullName: teacher.fullName };
  }

  public async getTeacherByFullName(fullName: string): Promise<Teacher> {
    const teacher = await getTeacherByFullName(fullName);
    if (!teacher) {
      throw new NotFoundError('Teacher does not exist');
    }
    return { id: teacher.id, fullName: teacher.fullName };
  }
}
