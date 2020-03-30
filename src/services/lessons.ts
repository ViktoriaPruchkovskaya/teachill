import * as lessonsRepository from '../repositories/lessons';
import { getGroupById } from '../repositories/groups';
import { getTeacherById } from '../repositories/teachers';
import { NotFoundError } from '../errors';

interface LessonData {
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  description?: string;
}

export interface Lesson {
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
    const res = await lessonsRepository.createLesson(lesson);
    return {
      id: res.id,
      name: res.name,
      typeId: res.typeId,
      location: res.location,
      startTime: res.startTime,
      duration: res.duration,
      description: res.description,
    };
  }

  public async getLessonTypes(): Promise<LessonType[]> {
    const lessonTypes = await lessonsRepository.getLessonTypes();
    return lessonTypes.map(type => ({ id: type.id, name: type.name }));
  }

  public async assignLessonToGroup(
    lessonId: number,
    groupId: number,
    subgroup: number = null
  ): Promise<void> {
    const lesson = await lessonsRepository.getLessonById(lessonId);
    const group = await getGroupById(groupId);
    if (!lesson || !group) {
      throw new NotFoundError('Lesson or group does not exist');
    }
    return lessonsRepository.assignLessonToGroup(lesson, group, subgroup);
  }

  public async getGroupLessons(groupId: number): Promise<Lesson[]> {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Group does not exist');
    }

    const lessons = await lessonsRepository.getGroupLessons(groupId);
    return lessons.map(lesson => ({
      id: lesson.id,
      name: lesson.name,
      typeId: lesson.typeId,
      location: lesson.location,
      startTime: lesson.startTime,
      duration: lesson.duration,
      description: lesson.description,
      teacher: lesson.teacher,
    }));
  }

  public async deleteGroupLessonsByGroupId(groupId: number): Promise<void> {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Group does not exist');
    }
    return lessonsRepository.deleteGroupLessonsById(groupId);
  }

  public async removeAllGroupLessons(): Promise<void> {
    return lessonsRepository.removeAllGroupLessons();
  }

  public async assignTeacherToLesson(lessonId: number, teacherId: number): Promise<void> {
    const teacher = await getTeacherById(teacherId);
    const lesson = await lessonsRepository.getLessonById(lessonId);
    if (!teacher || !lesson) {
      throw new NotFoundError('Teacher or lesson does not exist');
    }
    return lessonsRepository.assignTeacherToLesson(lessonId, teacherId);
  }
}
