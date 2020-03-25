import Router = require('koa-router');
import {
  getUsers,
  signupController,
  signinController,
  changePasswordController,
  changeRoleController,
  currentUserController,
  deleteUser,
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
import { shouldHaveRole } from './middlewares/permissions';
import { RoleType } from './services/users';

const router = new Router();
const shouldHaveAdminRole = shouldHaveRole([RoleType.Administrator]);

router.get('/', authMiddleware, shouldHaveAdminRole, getUsers);
router.post('/signup/', signupController);
router.post('/signin/', signinController);
router.put('/users/me/changePassword', authMiddleware, changePasswordController);
router.get('/users/me/', authMiddleware, currentUserController);
router.post('/groups/', authMiddleware, createGroupController);
router.get('/groups/', authMiddleware, getGroupsController);
router.post(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveAdminRole,
  createGroupMemberController
);
router.get(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveAdminRole,
  getGroupMembersController
);
router.put('/groups/:group_id/users/', authMiddleware, shouldHaveAdminRole, changeRoleController);
router.delete('/groups/:group_id/users/:user_id', authMiddleware, deleteUser);
router.post('/teachers/', authMiddleware, shouldHaveAdminRole, createTeacherController);
router.get('/teachers/', authMiddleware, shouldHaveAdminRole, getTeachersController);
router.post('/lessons/', authMiddleware, shouldHaveAdminRole, createLessonController);
router.get('/lessons/types/', authMiddleware, shouldHaveAdminRole, getLessonTypesController);
router.post(
  '/lessons/:id/teachers/',
  authMiddleware,
  shouldHaveAdminRole,
  assignTeacherToLessonController
);
router.post('/attachments/', authMiddleware, shouldHaveAdminRole, createAttachmentController);
router.delete('/attachments/:id/', authMiddleware, shouldHaveAdminRole, deleteAttachmentController);
router.post(
  '/groups/:group_id/lessons/',
  authMiddleware,
  shouldHaveAdminRole,
  createGroupLessonController
);
router.get('/groups/:group_id/lessons/', authMiddleware, getGroupLessonsController);
router.post(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id/',
  authMiddleware,
  shouldHaveAdminRole,
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
  shouldHaveAdminRole,
  deleteGroupLessonAttachmentController
);
export { router };
