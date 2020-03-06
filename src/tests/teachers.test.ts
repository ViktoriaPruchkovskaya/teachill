import { TeacherService } from '../services/teachers';
import * as teachersRepository from '../repositories/teachers';
import * as teacherMocks from '../mocks/teachers';

const mockedTeachers = teachersRepository as jest.Mocked<typeof teachersRepository>;

describe('test teachers service', () => {
  it('test teacher creation', async () => {
    teacherMocks.getNonexistentTeacher.mockClear();
    teacherMocks.getTeacher.mockClear();
    const FULL_NAME = 'Ivanov I.I.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getNonexistentTeacher;
    mockedTeachers.createTeacher = teacherMocks.getTeacher;

    const teacher = await teacherService.createTeacher(FULL_NAME);

    expect(mockedTeachers.getTeacherByFullName).toBeCalledTimes(1);
    expect(mockedTeachers.createTeacher).toBeCalledTimes(1);
    expect(teacher).toEqual({ id: 1, fullName: FULL_NAME });
  });

  it('test teacher creation with existing fullname', async () => {
    teacherMocks.getTeacher.mockClear();
    const FULL_NAME = 'Petrov A.P.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getTeacher;
    mockedTeachers.createTeacher = teacherMocks.getTeacher;

    const teacher = teacherService.createTeacher(FULL_NAME);

    expect(mockedTeachers.getTeacherByFullName).toBeCalledTimes(1);
    await expect(teacher).rejects.toThrow('Teacher already exists');
  });

  it('test getting teachers array', async () => {
    teacherMocks.getTeachers.mockClear();
    const teacherService = new TeacherService();
    mockedTeachers.getTeachers = teacherMocks.getTeachers;

    const teachers = await teacherService.getTeachers();

    expect(mockedTeachers.getTeachers).toBeCalledTimes(1);
    expect(teachers).toEqual([
      { id: 1, fullName: 'First T.' },
      { id: 2, fullName: 'Second T.' },
    ]);
  });

  it('test getting empty teachers array', async () => {
    teacherMocks.getEmptyTeachersArray.mockClear();
    const teacherService = new TeacherService();
    mockedTeachers.getTeachers = teacherMocks.getEmptyTeachersArray;

    const teachers = teacherService.getTeachers();

    expect(mockedTeachers.getTeachers).toBeCalledTimes(1);
    await expect(teachers).rejects.toThrow('Teachers do not exist');
  });

  it('test getting teacher by id', async () => {
    teacherMocks.getTeacherById.mockClear();
    const TEACHER_ID = 4;
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherById = teacherMocks.getTeacherById;

    const teacher = await teacherService.getTeacherById(TEACHER_ID);

    expect(mockedTeachers.getTeacherById).toBeCalledTimes(1);
    expect(teacher.id).toBe(TEACHER_ID);
  });

  it('test getting teacher by nonexistent id', async () => {
    teacherMocks.getNonexistentTeacher.mockClear();
    const TEACHER_ID = 7;
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherById = teacherMocks.getNonexistentTeacher;

    const teacher = teacherService.getTeacherById(TEACHER_ID);

    expect(mockedTeachers.getTeacherById).toBeCalledTimes(1);
    await expect(teacher).rejects.toThrow('Teacher does not exist');
  });

  it('test getting existed teacher by fullname', async () => {
    teacherMocks.getTeacher.mockClear();
    const FULL_NAME = 'Ivanov I.I.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getTeacher;

    const teacher = await teacherService.getTeacherByFullName(FULL_NAME);

    expect(mockedTeachers.getTeacherByFullName).toBeCalledTimes(1);
    expect(teacher.fullName).toBe(FULL_NAME);
  });

  it('test getting teacher by nonexistent fullname', async () => {
    teacherMocks.getNonexistentTeacher.mockClear();
    const FULL_NAME = 'Petrov A.A.';
    const teacherService = new TeacherService();
    mockedTeachers.getTeacherByFullName = teacherMocks.getNonexistentTeacher;

    const teacher = teacherService.getTeacherByFullName(FULL_NAME);

    expect(mockedTeachers.getTeacherByFullName).toBeCalledTimes(1);
    await expect(teacher).rejects.toThrow('Teacher does not exist');
  });
});
