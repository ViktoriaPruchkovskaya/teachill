import { createLesson } from '../repositories/lessons';

export interface Lesson {
  name: string;
  type: number | string;
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
      type: res.type,
      location: res.location,
      startTime: res.startTime,
      duration: res.duration,
      description: res.description,
    };
    return createdLesson;
  }
}
