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
import { shouldHaveRole } from './middlewares/permissions';
import { RoleType } from './services/users';

const router = new Router();

router.get('/', authMiddleware, shouldHaveRole([RoleType.Administrator]), getUsers);
router.post('/signup/', signupController);
router.post('/signin/', signinController);
router.put(
  '/users/me/changePassword',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator, RoleType.Member]),
  changePasswordController
);
router.get(
  '/users/me/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator, RoleType.Member]),
  currentUserController
);
router.post('/groups/', authMiddleware, createGroupController);
router.get('/groups/', authMiddleware, getGroupsController);
router.post(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  createGroupMemberController
);
router.get(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  getGroupMembersController
);
router.put(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  changeRoleController
);
router.post(
  '/teachers/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  createTeacherController
);
router.get(
  '/teachers/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  getTeachersController
);
router.post(
  '/lessons/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  createLessonController
);
router.get(
  '/lessons/types/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  getLessonTypesController
);
router.post(
  '/lessons/:id/teachers/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  assignTeacherToLessonController
);
router.post(
  '/attachments/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  createAttachmentController
);
router.delete(
  '/attachments/:id/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  deleteAttachmentController
);
router.post(
  '/groups/:group_id/lessons/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  createGroupLessonController
);
router.get(
  '/groups/:group_id/lessons/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator, RoleType.Member]),
  getGroupLessonsController
);
router.post(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  assignToGroupLessonController
);
router.get(
  '/groups/:group_id/lessons/:lesson_id/attachments/',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator, RoleType.Member]),
  getGroupLessonAttachmentController
);
router.delete(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id',
  authMiddleware,
  shouldHaveRole([RoleType.Administrator]),
  deleteGroupLessonAttachmentController
);
export { router };
