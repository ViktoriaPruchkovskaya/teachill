import {
  createLesson,
  getLessonTypes,
  createGroupLesson,
  getGroupLessons,
  deleteAllGroupLessons,
  assignTeacherToLesson,
} from '../repositories/lessons';
import { getGroupById } from '../repositories/groups';
import { NotFoundError } from '../errors';

interface LessonData {
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  description?: string;
}

interface Lesson {
  id: number;
  name: string;
  typeId: number;
  location: string;
  startTime: Date;
  duration: number;
  description?: string;
  teacher?: Teacher[];
}

interface LessonType {
  id: number;
  name: string;
}

interface Teacher {
  fullName: string;
}

export class LessonService {
  public async createLesson(lesson: LessonData): Promise<Lesson> {
    const res = await createLesson(lesson);
    const createdLesson: Lesson = {
      id: res.id,
      name: res.name,
      typeId: res.typeId,
      location: res.location,
      startTime: res.startTime,
      duration: res.duration,
      description: res.description,
    };
    return createdLesson;
  }

  public async getLessonTypes(): Promise<LessonType[]> {
    const res = await getLessonTypes();
    const lessonTypes: LessonType[] = res.map(type => {
      const res: LessonType = {
        id: type.id,
        name: type.name,
      };
      return res;
    });
    return lessonTypes;
  }

  public async createGroupLesson(lessonId: number, groupId: number): Promise<void> {
    return await createGroupLesson(lessonId, groupId);
  }

  public async getGroupLessons(groupId: number): Promise<Lesson[]> {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Group does not exist');
    }

    const res = await getGroupLessons(groupId);
    const groupLessons: Lesson[] = res.map(lesson => {
      const res: Lesson = {
        id: lesson.id,
        name: lesson.name,
        typeId: lesson.typeId,
        location: lesson.location,
        startTime: lesson.startTime,
        duration: lesson.duration,
        description: lesson.description,
        teacher: lesson.teacher,
      };
      return res;
    });
    return groupLessons;
  }

  public async deleteAllGroupLessons(groupId: number): Promise<void> {
    return await deleteAllGroupLessons(groupId);
  }

  public async assignTeacherToLesson(lessonId: number, teacherId: number): Promise<void> {
    return await assignTeacherToLesson(lessonId, teacherId);
  }
}
