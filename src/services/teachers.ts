import { createTeacher, getTeachers } from '../repositories/teachers';

interface CreatedTeacher {
  id: number;
  fullName: string;
}

export class TeacherService {
  public async createTeacher(fullName: string): Promise<CreatedTeacher> {
    const res = await createTeacher(fullName);
    const createdTeacher: CreatedTeacher = {
      id: res.id,
      fullName: res.fullName,
    };
    return createdTeacher;
  }

  public async getTeachers(): Promise<CreatedTeacher[]> {
    const res = await getTeachers();
    const createdTeacher: CreatedTeacher[] = res.map(teacher => {
      const res: CreatedTeacher = {
        id: teacher.id,
        fullName: teacher.fullName,
      };
      return res;
    });
    return createdTeacher;
  }
}
