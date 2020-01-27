import { createLesson, getLessonTypes } from '../repositories/lessons';

interface Lesson {
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  description?: string;
}

interface DBLesson {
  id: number;
  name: string;
  typeId: number;
  location: string;
  startTime: Date;
  duration: number;
  description?: string;
}

interface LessonType {
  id: number;
  name: string;
}

export class LessonService {
  public async createLesson(lesson: Lesson): Promise<DBLesson> {
    const res = await createLesson(lesson);
    const createdLesson: DBLesson = {
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
}
