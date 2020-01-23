import { createTeacher, getTeachers } from '../repositories/teachers';

interface CreatedTeacher {
  id: number;
  fullName: string;
}

export class TeacherService {
  public async createTeacher(fullName: string): Promise<CreatedTeacher> {
    const res = await createTeacher(fullName);
    const createdTeacher: CreatedTeacher = {
      id: res.id as number,
      fullName: res.fullName as string,
    };
    return createdTeacher;
  }

  public async getTeachers(): Promise<CreatedTeacher[]> {
    const res = await getTeachers();
    const createdTeacher: CreatedTeacher[] = res.map(teacher => {
      const res: CreatedTeacher = {
        id: teacher.id as number,
        fullName: teacher.fullName as string,
      };
      return res;
    });
    return createdTeacher;
  }
}
