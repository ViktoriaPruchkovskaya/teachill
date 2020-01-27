import {
  createLesson,
  getLessonTypes,
  createGroupLesson,
  getGroupLessons,
  getGroupLessonsById,
} from '../repositories/lessons';

interface Lesson {
  name: string;
  typeId: number;
  location: number;
  startTime: string;
  duration: number;
  description?: string;
}

interface LessonType {
  id: number;
  name: string;
}

export class LessonService {
  public async createLesson(lesson: Lesson): Promise<Lesson> {
    const res = await createLesson(lesson);
    const createdLesson: Lesson = {
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
    const lesson = getGroupLessonsById(groupId);
    if (lesson) {
      throw new Error('Lesson already added');
    }
    return await createGroupLesson(lessonId, groupId);
  }

  public async getGroupLessons(groupId: number): Promise<Lesson[]> {
    const res = await getGroupLessons(groupId);
    const groupLessons: Lesson[] = res.map(lesson => {
      const res: Lesson = {
        name: lesson.name as string,
        typeId: lesson.typeId as number,
        location: lesson.location as number,
        startTime: lesson.startTime as string,
        duration: lesson.duration as number,
        description: lesson.description as string,
      };
      return res;
    });
    return groupLessons;
  }
}
