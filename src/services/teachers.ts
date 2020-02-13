import { createTeacher, getTeachers } from '../repositories/teachers';

interface CreatedTeacher {
  id: number;
  fullName: string;
}

export class TeacherService {
  public async createTeacher(fullName: string): Promise<CreatedTeacher> {
    const res = await createTeacher(fullName);
    return { id: res.id, fullName: res.fullName };
  }

  public async getTeachers(): Promise<CreatedTeacher[]> {
    const res = await getTeachers();
    return res.map(teacher => ({ id: teacher.id, fullName: teacher.fullName }));
  }
}
