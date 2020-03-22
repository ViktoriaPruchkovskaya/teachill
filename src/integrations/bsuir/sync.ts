import * as dotenv from 'dotenv';
import { DatabaseConnection, DatabaseConfiguration } from '../../db/connection';
import { GroupService } from '../../services/groups';
import { GroupSyncService } from './syncGroup';
import { LessonService } from '../../services/lessons';

dotenv.config();
const dbConfig: DatabaseConfiguration = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
};

DatabaseConnection.initConnection(dbConfig);

const lessonService = new LessonService();
const groupService = new GroupService();
const groupSyncService = new GroupSyncService();
lessonService.removeAllGroupLessons();
groupService
  .getGroups()
  .then(groups =>
    Promise.all(groups.map(group => groupSyncService.syncGroup(group.id, Number(group.name))))
  )
  .catch(err => console.error(err));
