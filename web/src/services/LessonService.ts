import { StorageService } from './storageService';
import { LessonClient } from '../clients/lessonClient';
import { organizeLessons } from '../utils/lessons';

interface UpdateLessonPayload {
  id: number;
  description: string;
}

interface Teacher {
  fullName: string;
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
  isAttachmentAssigned?: boolean;
}

export class LessonService {
  private storageService: StorageService;
  private lessonClient: LessonClient;

  constructor() {
    this.storageService = new StorageService();
    const token = this.storageService.getToken();
    this.lessonClient = new LessonClient(token);
  }

  public async updateLesson(payload: UpdateLessonPayload): Promise<void> {
    return this.lessonClient.updateLesson(payload);
  }

  private async getLessons(): Promise<Lesson[]> {
    const lessons = await this.lessonClient.getLessons();

    const subgroups = this.getSubgroups(lessons);
    this.storageService.setSubgroups(subgroups);

    return lessons.map(lesson => ({
      id: lesson.id,
      name: lesson.name,
      typeId: lesson.typeId,
      location: lesson.location,
      startTime: new Date(lesson.startTime),
      duration: lesson.duration,
      description: lesson.description,
      teacher: lesson.teacher,
      subgroup: lesson.subgroup,
      isAttachmentAssigned: lesson.isAttachmentAssigned,
    }));
  }

  private getSubgroups(lessons: Lesson[]): Array<number> {
    const subgroups = new Set<number>();
    lessons.map(lesson => subgroups.add(lesson.subgroup));
    return Array.from(subgroups);
  }

  public async getSchedule(): Promise<Lesson[][][]> {
    /**
     * @name lessons - Array of lessons sorted by date
     * @function organizedLessons returns an array, that contains array of lessons formed by weeks
     */

    const groupLessons = await this.getLessons();
    const lessons = groupLessons.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return organizeLessons(lessons);
  }

  public async createSchedule(groupId: number): Promise<void> {
    await this.lessonClient.createSchedule(groupId);
  }

  public async updateSchedule(): Promise<void> {
    await this.lessonClient.updateSchedule();
  }
}
