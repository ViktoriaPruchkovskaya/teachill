import { createGroup } from '../repositories/education';
import { createTeacher, Teacher, getTeachers } from '../repositories/teachers';
import { createLesson } from '../repositories/lessons';

export interface Lesson {
  name: string;
  typeId: number;
  location: number;
  startTime: string;
  duration: number;
  description?: string;
}

export class GroupService {
  public async createGroup(id: number, name: string): Promise<number> {
    return await createGroup(id, name);
  }
}

export class TeacherService {
  public async createTeacher(fullName: string): Promise<Teacher> {
    return await createTeacher(fullName);
  }

  public async getTeachers(): Promise<Teacher[]> {
    return await getTeachers();
  }
}

export class LessonService {
  public async createLesson(lesson: Lesson): Promise<Lesson> {
    return await createLesson(lesson);
  }
}
