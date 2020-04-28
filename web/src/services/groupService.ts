import { GroupClient } from '../clients/groupClient';
import { StorageService } from './storageService';
import { organizeLessons } from '../utils/lessons';

interface GroupPayload {
  name: string;
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
}

export interface Group {
  id: number;
  name: string;
}

export class GroupService {
  private groupClient: GroupClient;
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    const token = this.storageService.getToken();
    this.groupClient = new GroupClient(token);
  }

  public async createGroup(payload: GroupPayload): Promise<number> {
    return this.groupClient.createGroup(payload);
  }

  public async assignUserToGroup(groupId: number, userId: number): Promise<void> {
    await this.groupClient.assignUserToGroup(groupId, userId);
  }

  public async getCurrentGroup(): Promise<Group> {
    const group = await this.groupClient.getCurrentGroup();
    this.storageService.setUserGroup(group);
    return group;
  }

  private async getLessons(): Promise<Lesson[]> {
    const lessons = await this.groupClient.getLessons();
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
    }));
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
}
