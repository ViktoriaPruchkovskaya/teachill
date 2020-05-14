import * as dotenv from 'dotenv';
import { DatabaseConnection, DatabaseConfiguration } from '../../db/connection';
import { GroupService, Group } from '../../services/groups';
import { GroupSyncService } from './syncGroup';
import { LessonService } from '../../services/lessons';
import { User } from '../../services/users';

dotenv.config();
const dbConfig: DatabaseConfiguration = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
};

DatabaseConnection.initConnection(dbConfig);

export class SyncBSUIR {
  private lessonService: LessonService;
  private groupService: GroupService;
  private groupSyncService: GroupSyncService;

  constructor() {
    this.lessonService = new LessonService();
    this.groupService = new GroupService();
    this.groupSyncService = new GroupSyncService();
  }

  public async createSchedule(groupId: number): Promise<void> {
    const group = await this.groupService.getGroupById(groupId);
    await this.syncBSUIR(group);
  }

  public async updateSchedule(user: User): Promise<void> {
    const group = await this.groupService.getCurrentGroup(user);
    await this.lessonService.removeGroupSchedule(group.id);
    await this.syncBSUIR(group);
  }

  private async syncBSUIR(group: Group): Promise<void> {
    await this.groupSyncService.syncGroup(group.id, Number(group.name));
  }
}
