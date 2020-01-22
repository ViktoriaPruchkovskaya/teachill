import { createGroup } from '../repositories/education';
import { createTeacher, Teacher, getTeachers } from '../repositories/teachers';
import { createLesson } from '../repositories/lessons';

export class GroupService {
  public async createGroup(id: number, name: string): Promise<number> {
    return await createGroup(id, name);
  }
}

export class TeacherService {
  public async createTeacher(fullName: string): Promise<void> {
    return await createTeacher(fullName);
  }

  public async getTeachers(): Promise<Teacher[]> {
    return await getTeachers();
  }
}

export class LessonService {
  public async createLesson(
    name: string,
    typeId: number,
    location: number,
    startTime: string,
    duration: number,
    description?: string
  ): Promise<void> {
    return await createLesson(name, typeId, location, startTime, duration, description);
  }
}
