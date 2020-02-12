import Router = require('koa-router');
import {
  getUsers,
  signupController,
  signinController,
  changePasswordController,
  changeRoleController,
  currentUserController,
} from './controllers/users';
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
  deleteGroupLessonAttachmentController,
  deleteAttachmentController,
} from './controllers/attachments';
import {
  createLessonController,
  getLessonTypesController,
  createGroupLessonController,
  getGroupLessonsController,
  assignTeacherToLessonController,
} from './controllers/lessons';

const router = new Router();

router.get('/', getUsers);
router.post('/signup/', signupController);
router.post('/signin/', signinController);
router.put('/users/:username/', authMiddleware, changePasswordController);
router.get('/users/me/', authMiddleware, currentUserController);
router.post('/groups/', authMiddleware, createGroupController);
router.get('/groups/', authMiddleware, getGroupsController);
router.post('/groups/:group_id/users/', authMiddleware, createGroupMemberController);
router.get('/groups/:group_id/users/', authMiddleware, getGroupMembersController);
router.put('/groups/:group_id/users/', authMiddleware, changeRoleController);
router.post('/teachers/', authMiddleware, createTeacherController);
router.get('/teachers/', authMiddleware, getTeachersController);
router.post('/lessons/', authMiddleware, createLessonController);
router.get('/lessons/types/', authMiddleware, getLessonTypesController);
router.post('/lessons/:id/teachers/', authMiddleware, assignTeacherToLessonController);
router.post('/attachments/', authMiddleware, createAttachmentController);
router.delete('/attachments/:id/', authMiddleware, deleteAttachmentController);
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
  deleteGroupLessonAttachmentController
);
export { router };
