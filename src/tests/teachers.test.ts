jest.mock('../repositories/teachers');
import { TeacherService } from '../services/teachers';
import * as teachersRepository from '../repositories/teachers';
import * as teacherMocks from '../mocks/teachers';

const mockedTeachers = teachersRepository as jest.Mocked<typeof teachersRepository>;

describe('test teachers servise', () => {
  it('test teacher creation', async () => {
    const FULL_NAME = 'Ivanov I.I.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getNonexistentTeacher;
    mockedTeachers.createTeacher = teacherMocks.getTeacher;

    const teacher = await teacherService.createTeacher(FULL_NAME);

    expect(teacher).toEqual({ id: 1, fullName: FULL_NAME });
  });

  it('test teacher creation with existing fullname', async () => {
    const FULL_NAME = 'Petrov A.P.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getTeacher;

    const teacher = teacherService.createTeacher(FULL_NAME);

    await expect(teacher).rejects.toThrow('Teacher already exists');
  });

  it('test getting teachers array', async () => {
    const teacherService = new TeacherService();
    mockedTeachers.getTeachers = teacherMocks.getTeachers;

    const teachers = await teacherService.getTeachers();

    expect(teachers).toEqual([
      { id: 1, fullName: 'First T.' },
      { id: 2, fullName: 'Second T.' },
    ]);
  });

  it('test getting empty teachers array', async () => {
    const teacherService = new TeacherService();
    mockedTeachers.getTeachers = teacherMocks.getEmptyTeachersArray;

    const teachers = teacherService.getTeachers();

    await expect(teachers).rejects.toThrow('Teachers do not exist');
  });

  it('test getting teacher by id', async () => {
    const TEACHER_ID = 4;
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherById = teacherMocks.getTeacherById;

    const teacher = await teacherService.getTeacherById(TEACHER_ID);

    expect(teacher.id).toBe(TEACHER_ID);
  });

  it('test getting teacher by nonexistent id', async () => {
    const TEACHER_ID = 7;
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherById = teacherMocks.getNonexistentTeacher;

    const teacher = teacherService.getTeacherById(TEACHER_ID);

    await expect(teacher).rejects.toThrow('Teacher does not exist');
  });

  it('test getting existed teacher by fullname', async () => {
    const FULL_NAME = 'Ivanov I.I.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getTeacher;

    const teacher = await teacherService.getTeacherByFullName(FULL_NAME);

    expect(teacher.fullName).toBe(FULL_NAME);
  });

  it('test getting teacher by nonexistent fullname', async () => {
    const FULL_NAME = 'Petrov A.A.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getNonexistentTeacher;

    const teacher = teacherService.getTeacherByFullName(FULL_NAME);

    await expect(teacher).rejects.toThrow('Teacher does not exist');
  });
});
