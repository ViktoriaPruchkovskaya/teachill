import { DBGroup } from '../../repositories/groups';
import { DBLesson, RawLesson } from '../../repositories/lessons';

export const getGroupLessonById = () =>
  jest.fn((groupId: number, lessonId: number) =>
    Promise.resolve({
      id: lessonId,
      name: 'lesson1',
      typeId: 2,
      location: '610-5',
      startTime: new Date('2020-01-01T00:00:00'),
      duration: 100,
      description: '',
      teachers: ['Ivanov I.I.'],
    })
  );

export const getNonexistentGroupLessonById = () =>
  jest.fn((groupId: number, lessonId: number) => Promise.resolve(null));

export const createLesson = () =>
  jest.fn((obj: RawLesson) =>
    Promise.resolve({
      id: 1,
      name: obj.name,
      typeId: obj.typeId,
      location: obj.location,
      startTime: new Date(obj.startTime),
      duration: obj.duration,
      description: obj.description || '',
    })
  );

export const getLessonTypes = () =>
  jest.fn(() =>
    Promise.resolve([
      { id: 1, name: 'Lecture' },
      { id: 1, name: 'Laboratory' },
    ])
  );

export const getEmptyLessonTypesArray = () => jest.fn(() => Promise.resolve([]));

export const getLessonById = () =>
  jest.fn((lessonId: number) =>
    Promise.resolve({
      id: lessonId,
      name: 'lesson1',
      typeId: 2,
      location: '610-5',
      startTime: new Date('2020-01-01T00:00:00'),
      duration: 100,
      description: '',
      teachers: ['Ivanov I.I.'],
    })
  );

export const getNonexistentLessonById = () => jest.fn((lessonId: number) => Promise.resolve(null));

export const createGroupLesson = () =>
  jest.fn((lesson: DBLesson, group: DBGroup, subgroup: number) => Promise.resolve());

export const getGroupLessons = () =>
  jest.fn((groupId: number) =>
    Promise.resolve([
      {
        id: 1,
        name: 'lesson1',
        typeId: 2,
        location: '610-5',
        startTime: new Date('2020-01-01T00:00:00'),
        duration: 100,
        description: '',
        teachers: ['Ivanov I.I.'],
        subgroup: 1,
      },
      {
        id: 2,
        name: 'lesson2',
        typeId: 2,
        location: '610-5',
        startTime: new Date('2020-01-21T00:00:00'),
        duration: 200,
        description: '',
        teachers: ['Petrov P.P'],
        subgroup: 1,
      },
    ])
  );

export const getEmptyLessonsArray = () => jest.fn((groupId: number) => Promise.resolve([]));

export const deleteGroupLessons = () => jest.fn((groupId: number) => Promise.resolve());

export const assignTeacherToLesson = () =>
  jest.fn((lessonId: number, teacherId: number) => Promise.resolve());

export const deleteAllGroupLessons = () => jest.fn(() => Promise.resolve());
