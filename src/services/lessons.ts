import * as lessonsRepository from '../repositories/lessons';
import { getGroupById, getMembershipById } from '../repositories/groups';
import { getTeacherById } from '../repositories/teachers';
import { NotFoundError } from '../errors';
import { User, UserService } from './users';
import { toUnixFromDate } from '../utils/date';

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
  subgroup?: number | null;
}

export interface LessonForUpdate {
  id: number;
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  description?: string;
  teacher?: Teacher[];
  subgroup?: number | null;
}

interface LessonType {
  id: number;
  name: string;
}

interface Teacher {
  fullName: string;
}

interface UpdateLessonData {
  description?: string;
}

export class LessonService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

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

  public async getGroupLessons(currentUser: User): Promise<Lesson[]> {
    const currentGroup = await getMembershipById(currentUser.id);
    if (!currentGroup) {
      throw new NotFoundError('Group not found');
    }

    const lessons = await lessonsRepository.getGroupLessons(currentGroup.id);
    return lessons.map(lesson => ({
      id: lesson.id,
      name: lesson.name,
      typeId: lesson.typeId,
      location: lesson.location,
      startTime: lesson.startTime,
      duration: lesson.duration,
      description: lesson.description,
      teacher: lesson.teacher,
      subgroup: lesson.subgroup,
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

  public async updateLesson(user: User, lessonId: number, info: UpdateLessonData): Promise<void> {
    await this.userService.getUserByUsername(user.username);
    const dbLesson = await lessonsRepository.getLessonById(lessonId);

    if (!dbLesson) {
      throw new NotFoundError('Lesson not found');
    }

    const lesson: LessonForUpdate = {
      id: dbLesson.id,
      name: dbLesson.name,
      typeId: dbLesson.typeId,
      location: dbLesson.location,
      startTime: toUnixFromDate(dbLesson.startTime),
      duration: dbLesson.duration,
      description: dbLesson.description,
      teacher: dbLesson.teacher,
      subgroup: dbLesson.subgroup,
    };

    for (const key in info) {
      lesson[key] = info[key];
    }

    await lessonsRepository.updateLesson(lesson);
  }
}
