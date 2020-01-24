import { createLesson } from '../repositories/lessons';

interface Lesson {
  name: string;
  typeId: number;
  location: number;
  startTime: string;
  duration: number;
  description?: string;
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
}
