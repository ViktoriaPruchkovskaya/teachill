import * as teachersRepository from '../repositories/teachers';
import { NotFoundError, ExistError } from '../errors';

export interface Teacher {
  id: number;
  fullName: string;
}

export class TeacherService {
  public async createTeacher(fullName: string): Promise<Teacher> {
    const dbTeacher = await teachersRepository.getTeacherByFullName(fullName);
    if (dbTeacher) {
      throw new ExistError('Teacher already exists');
    }
    const teacher = await teachersRepository.createTeacher(fullName);
    return { id: teacher.id, fullName: teacher.fullName };
  }

  public async getTeachers(): Promise<Teacher[]> {
    const teachers = await teachersRepository.getTeachers();
    return teachers.map(teacher => ({ id: teacher.id, fullName: teacher.fullName }));
  }

  public async getTeacherById(id: number): Promise<Teacher> {
    const teacher = await teachersRepository.getTeacherById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher does not exist');
    }
    return { id: teacher.id, fullName: teacher.fullName };
  }

  public async getTeacherByFullName(fullName: string): Promise<Teacher> {
    const teacher = await teachersRepository.getTeacherByFullName(fullName);
    if (!teacher) {
      throw new NotFoundError('Teacher does not exist');
    }
    return { id: teacher.id, fullName: teacher.fullName };
  }

  public async getOrCreateTeacher(fullName: string): Promise<Teacher> {
    let teacher: Teacher;
    try {
      teacher = await this.getTeacherByFullName(fullName);
    } catch (err) {
      if (err instanceof NotFoundError) {
        teacher = await this.createTeacher(fullName);
      }
    }
    return teacher;
  }
}
