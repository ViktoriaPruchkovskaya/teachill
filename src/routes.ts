import Router = require('koa-router');
import { getUsers, signupController, signinController } from './controllers/users';
import { authMiddleware } from './middlewares/authentication';
import {
  createGroupController,
  getGroupsController,
  createGroupMemberController,
  getGroupMembersController,
} from './controllers/groups';
import { createTeacherController, getTeachersController } from './controllers/teachers';
import {
  createAttachmentController,
  assignToGroupLessonController,
  getGroupLessonAttachmentController,
  deleteAttachment,
} from './controllers/attachments';
import {
  createLessonController,
  getLessonTypesController,
  createGroupLessonController,
  getGroupLessonsController,
} from './controllers/lessons';

const router = new Router();

router.get('/', getUsers);
router.post('/signup/', signupController);
router.post('/signin/', signinController);
router.post('/groups/', authMiddleware, createGroupController);
router.get('/groups/', authMiddleware, getGroupsController);
router.post('/groups/:group_id/users/', authMiddleware, createGroupMemberController);
router.get('/groups/:group_id/users/', authMiddleware, getGroupMembersController);
router.post('/teachers/', authMiddleware, createTeacherController);
router.get('/teachers/', authMiddleware, getTeachersController);
router.post('/lessons/', authMiddleware, createLessonController);
router.get('/lessons/types/', authMiddleware, getLessonTypesController);
router.post('/attachments/', authMiddleware, createAttachmentController);
router.post('/groups/:group_id/lessons/', authMiddleware, createGroupLessonController);
router.get('/groups/:group_id/lessons/', authMiddleware, getGroupLessonsController);
router.post(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id/',
  authMiddleware,
  assignToGroupLessonController
);
router.get(
  '/groups/:group_id/lessons/:lesson_id/attachments/',
  authMiddleware,
  getGroupLessonAttachmentController
);
router.delete(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id',
  authMiddleware,
  deleteAttachment
);
export { router };
