import { LessonService } from '../services/lessons';
import * as lessonsRepository from '../repositories/lessons';
import * as groupsRepository from '../repositories/groups';
import * as teachersRepository from '../repositories/teachers';
import * as attachmentsRepository from '../repositories/attachments';
import * as lessonMocks from './mocks/lessons';
import {
  getGroupById,
  getNonexistentGroup,
  getMembershipById,
  getNonexistentMembershipById,
} from './mocks/groups';
import { getTeacherById, getNonexistentTeacher } from './mocks/teachers';
import { getGroupAttachments, getEmptyGroupAttachmentsArray } from './mocks/attachments';

const mockedLessons = lessonsRepository as jest.Mocked<typeof lessonsRepository>;
const mockedGroups = groupsRepository as jest.Mocked<typeof groupsRepository>;
const mockedTeachers = teachersRepository as jest.Mocked<typeof teachersRepository>;
const mockedAttachments = attachmentsRepository as jest.Mocked<typeof attachmentsRepository>;

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
    mockedLessons.assignLessonToGroup = lessonMocks.assignLessonToGroup();

    await lessonService.assignLessonToGroup(LESSON_ID, GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.assignLessonToGroup).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect((await mockedLessons.getLessonById(LESSON_ID)).id).toBe(LESSON_ID);
  });

  it('test lesson assingment to nonexistent group', async () => {
    const GROUP_ID = 2;
    const LESSON_ID = 4;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getNonexistentGroup();
    mockedLessons.getLessonById = lessonMocks.getLessonById();
    mockedLessons.assignLessonToGroup = lessonMocks.assignLessonToGroup();

    await expect(lessonService.assignLessonToGroup(LESSON_ID, GROUP_ID)).rejects.toThrow(
      'Lesson or group does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.assignLessonToGroup).not.toBeCalled();
    expect(await mockedGroups.getGroupById(GROUP_ID)).toBeNull();
    expect((await mockedLessons.getLessonById(LESSON_ID)).id).toBe(LESSON_ID);
  });

  it('test nonexistent lesson assingment to group', async () => {
    const GROUP_ID = 2;
    const LESSON_ID = 4;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getGroupById();
    mockedLessons.getLessonById = lessonMocks.getNonexistentLessonById();
    mockedLessons.assignLessonToGroup = lessonMocks.assignLessonToGroup();

    await expect(lessonService.assignLessonToGroup(LESSON_ID, GROUP_ID)).rejects.toThrow(
      'Lesson or group does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.getLessonById).toBeCalledTimes(1);
    expect(mockedLessons.assignLessonToGroup).not.toBeCalled();
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(await mockedLessons.getLessonById(LESSON_ID)).toBeNull();
  });

  it('test getting lessons of group', async () => {
    const USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const lessonService = new LessonService();
    mockedGroups.getMembershipById = getMembershipById();
    mockedLessons.getGroupLessons = lessonMocks.getGroupLessons();
    mockedAttachments.getGroupAttachments = getGroupAttachments();

    const lessons = await lessonService.getGroupLessons(USER);

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessons).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupAttachments).toBeCalledTimes(1);
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
        'subgroup',
        'isAttachmentAssigned',
      ])
    );
    expect((await mockedGroups.getMembershipById(USER.id)).id).toBe(2);
    expect(
      await mockedAttachments.getGroupAttachments(
        (await mockedGroups.getMembershipById(USER.id)).id
      )
    ).toEqual([
      { lessonId: 2, attachmentId: 3, name: 'attachment', url: 'https://attachment.com/4vd1o' },
      { lessonId: 3, attachmentId: 4, name: 'attachment', url: 'https://attachment.com/4vd1o' },
    ]);
  });

  it('test getting lessons of nonexistent group', async () => {
    const USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const lessonService = new LessonService();
    mockedGroups.getMembershipById = getNonexistentMembershipById();
    mockedLessons.getGroupLessons = lessonMocks.getGroupLessons();
    mockedAttachments.getGroupAttachments = getGroupAttachments();

    await expect(lessonService.getGroupLessons(USER)).rejects.toThrow('Group not found');

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessons).not.toBeCalled();
    expect(mockedAttachments.getGroupAttachments).not.toBeCalled();
    expect(await mockedGroups.getMembershipById(USER.id)).toBeNull();
  });

  it('test getting emty array lessons of group', async () => {
    const USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const lessonService = new LessonService();
    mockedGroups.getMembershipById = getMembershipById();
    mockedLessons.getGroupLessons = lessonMocks.getEmptyLessonsArray();
    mockedAttachments.getGroupAttachments = getEmptyGroupAttachmentsArray();

    const lessons = await lessonService.getGroupLessons(USER);

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessons).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupAttachments).toBeCalledTimes(1);
    expect((await mockedGroups.getMembershipById(USER.id)).id).toBe(2);
    expect(lessons).toEqual([]);
    expect(
      await mockedAttachments.getGroupAttachments(
        (await mockedGroups.getMembershipById(USER.id)).id
      )
    ).toEqual([]);
  });

  it('test removing all lessons of group', async () => {
    const GROUP_ID = 3;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getGroupById();
    mockedLessons.deleteGroupLessonsById = lessonMocks.deleteGroupLessons();

    await lessonService.deleteGroupLessonsByGroupId(GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.deleteGroupLessonsById).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
  });

  it('test removing all lessons of nonexistent group', async () => {
    const GROUP_ID = 3;
    const lessonService = new LessonService();
    mockedGroups.getGroupById = getNonexistentGroup();
    mockedLessons.deleteGroupLessonsById = lessonMocks.deleteGroupLessons();

    await expect(lessonService.deleteGroupLessonsByGroupId(GROUP_ID)).rejects.toThrow(
      'Group does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedLessons.deleteGroupLessonsById).not.toBeCalled();
    expect(await mockedGroups.getGroupById(GROUP_ID)).toBeNull();
  });

  it('test removing lessons of all groups', async () => {
    const lessonService = new LessonService();
    mockedLessons.removeAllGroupLessons = lessonMocks.deleteAllGroupLessons();

    await lessonService.removeAllGroupLessons();

    expect(mockedLessons.removeAllGroupLessons).toBeCalledTimes(1);
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
