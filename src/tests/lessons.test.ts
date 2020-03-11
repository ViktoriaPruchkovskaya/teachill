import { LessonService } from '../services/lessons';
import * as lessonsRepository from '../repositories/lessons';
import * as groupsRepository from '../repositories/groups';
import * as teachersRepository from '../repositories/teachers';
import * as lessonMocks from './mocks/lessons';
import { getGroupById, getNonexistentGroup } from './mocks/groups';
import { getTeacherById, getNonexistentTeacher } from './mocks/teachers';

const mockedLessons = lessonsRepository as jest.Mocked<typeof lessonsRepository>;
const mockedGroups = groupsRepository as jest.Mocked<typeof groupsRepository>;
const mockedTeachers = teachersRepository as jest.Mocked<typeof teachersRepository>;

describe('test lessons service', () => {
  it('test lesson creation', async () => {
    const LESSON_DATA = {
      name: 'lesson',
      typeId: 2,
      location: '610-2',
      startTime: '2020-01-01T00:00:00',
      duration: 200,
    };
    const lessonService = new LessonService();
    mockedLessons.createLesson = lessonMocks.createLesson();

    const lesson = await lessonService.createLesson(LESSON_DATA);

    expect(mockedLessons.createLesson).toBeCalledTimes(1);
    expect(lesson.name).toBe(LESSON_DATA.name);
  });

  it('test getting lesson types', async () => {
    const lessonService = new LessonService();
    mockedLessons.getLessonTypes = lessonMocks.getLessonTypes();

    const lessonTypes = await lessonService.getLessonTypes();

    expect(mockedLessons.getLessonTypes).toBeCalledTimes(1);
    expect(lessonTypes).toEqual([
      { id: 1, name: 'Lecture' },
      { id: 1, name: 'Laboratory' },
    ]);
  });

  it('test getting nonexistent lesson types', async () => {
    const lessonService = new LessonService();
    mockedLessons.getLessonTypes = lessonMocks.getEmptyLessonTypesArray();

    const lessonTypes = await lessonService.getLessonTypes();

    expect(mockedLessons.getLessonTypes).toBeCalledTimes(1);
    expect(lessonTypes).toEqual([]);
  });

  it('test lesson assignment to group', async () => {
    const GROUP_ID = 2;
    const LESSON_ID = 4;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getGroupById();
    mockedLessons.getLessonById = lessonMocks.getLessonById();
    mockedLessons.createGroupLesson = lessonMocks.createGroupLesson();

    await lessonService.createGroupLesson(LESSON_ID, GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.createGroupLesson).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect((await mockedLessons.getLessonById(LESSON_ID)).id).toBe(LESSON_ID);
  });

  it('test lesson assingment to nonexistent group', async () => {
    const GROUP_ID = 2;
    const LESSON_ID = 4;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getNonexistentGroup();
    mockedLessons.getLessonById = lessonMocks.getLessonById();
    mockedLessons.createGroupLesson = lessonMocks.createGroupLesson();

    await expect(lessonService.createGroupLesson(LESSON_ID, GROUP_ID)).rejects.toThrow(
      'Lesson or group does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.createGroupLesson).not.toBeCalled();
    expect(await mockedGroups.getGroupById(GROUP_ID)).toBeNull();
    expect((await mockedLessons.getLessonById(LESSON_ID)).id).toBe(LESSON_ID);
  });

  it('test nonexistent lesson assingment to group', async () => {
    const GROUP_ID = 2;
    const LESSON_ID = 4;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getGroupById();
    mockedLessons.getLessonById = lessonMocks.getNonexistentLessonById();
    mockedLessons.createGroupLesson = lessonMocks.createGroupLesson();

    await expect(lessonService.createGroupLesson(LESSON_ID, GROUP_ID)).rejects.toThrow(
      'Lesson or group does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.createGroupLesson).not.toBeCalled();
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(await mockedLessons.getLessonById(LESSON_ID)).toBeNull();
  });

  it('test getting lessons of group', async () => {
    const GROUP_ID = 2;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getGroupById();
    mockedLessons.getGroupLessons = lessonMocks.getGroupLessons();

    const lessons = await lessonService.getGroupLessons(GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessons).toBeCalledTimes(1);
    lessons.map(lesson =>
      expect(Object.keys(lesson)).toEqual([
        'id',
        'name',
        'typeId',
        'location',
        'startTime',
        'duration',
        'description',
        'teacher',
      ])
    );
  });

  it('test getting lessons of nonexistent group', async () => {
    const GROUP_ID = 3;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getNonexistentGroup();
    mockedLessons.getGroupLessons = lessonMocks.getGroupLessons();

    await expect(lessonService.getGroupLessons(GROUP_ID)).rejects.toThrow('Group does not exist');

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessons).not.toBeCalled();
    expect(await mockedGroups.getGroupById(GROUP_ID)).toBeNull();
  });

  it('test getting emty array lessons of group', async () => {
    const GROUP_ID = 4;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getGroupById();
    mockedLessons.getGroupLessons = lessonMocks.getEmptyLessonsArray();

    const lessons = await lessonService.getGroupLessons(GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessons).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(lessons).toEqual([]);
  });

  it('test removing all lessons of group', async () => {
    const GROUP_ID = 3;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getGroupById();
    mockedLessons.deleteAllGroupLessons = lessonMocks.deleteGroupLessons();

    await lessonService.deleteAllGroupLessons(GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.deleteAllGroupLessons).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
  });

  it('test removing all lessons of nonexistent group', async () => {
    const GROUP_ID = 3;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getNonexistentGroup();
    mockedLessons.deleteAllGroupLessons = lessonMocks.deleteGroupLessons();

    await expect(lessonService.deleteAllGroupLessons(GROUP_ID)).rejects.toThrow(
      'Group does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.deleteAllGroupLessons).not.toBeCalled();
    expect(await mockedGroups.getGroupById(GROUP_ID)).toBeNull();
  });

  it('test teacher assignment to lesson', async () => {
    const TEACHER_ID = 1;
    const LESSON_ID = 2;
    const lessonService = new LessonService();
    mockedTeachers.getTeacherById = getTeacherById();
    mockedLessons.getLessonById = lessonMocks.getLessonById();
    mockedLessons.assignTeacherToLesson = lessonMocks.assignTeacherToLesson();

    await lessonService.assignTeacherToLesson(LESSON_ID, TEACHER_ID);

    expect(mockedTeachers.getTeacherById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.assignTeacherToLesson).toBeCalledTimes(1);
    expect((await mockedTeachers.getTeacherById(TEACHER_ID)).id).toBe(TEACHER_ID);
    expect((await mockedLessons.getLessonById(LESSON_ID)).id).toBe(LESSON_ID);
  });

  it('test teacher assignment to nonexistent lesson', async () => {
    const TEACHER_ID = 1;
    const LESSON_ID = 5;
    const lessonService = new LessonService();
    mockedTeachers.getTeacherById = getNonexistentTeacher();
    mockedLessons.getLessonById = lessonMocks.getLessonById();
    mockedLessons.assignTeacherToLesson = lessonMocks.assignTeacherToLesson();

    await expect(lessonService.assignTeacherToLesson(LESSON_ID, TEACHER_ID)).rejects.toThrow(
      'Teacher or lesson does not exist'
    );

    expect(mockedTeachers.getTeacherById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.assignTeacherToLesson).not.toBeCalled();
    expect(await mockedTeachers.getTeacherById(TEACHER_ID)).toBeNull();
    expect((await mockedLessons.getLessonById(LESSON_ID)).id).toBe(LESSON_ID);
  });

  it('test nonexistent teacher assignment to lesson', async () => {
    const TEACHER_ID = 4;
    const LESSON_ID = 2;
    const lessonService = new LessonService();
    mockedTeachers.getTeacherById = getTeacherById();
    mockedLessons.getLessonById = lessonMocks.getNonexistentLessonById();
    mockedLessons.assignTeacherToLesson = lessonMocks.assignTeacherToLesson();

    await expect(lessonService.assignTeacherToLesson(LESSON_ID, TEACHER_ID)).rejects.toThrow(
      'Teacher or lesson does not exist'
    );

    expect(mockedTeachers.getTeacherById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.assignTeacherToLesson).not.toBeCalled();
    expect((await mockedTeachers.getTeacherById(TEACHER_ID)).id).toBe(TEACHER_ID);
    expect(await mockedLessons.getLessonById(LESSON_ID)).toBeNull();
  });
});
