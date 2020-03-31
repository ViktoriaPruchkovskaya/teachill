import Router = require('koa-router');
import * as usersControllers from './controllers/users';
import * as groupsControllers from './controllers/groups';
import * as teachersControllers from './controllers/teachers';
import * as attachmentsControllers from './controllers/attachments';
import * as lessonsControllers from './controllers/lessons';
import { authMiddleware } from './middlewares/authentication';
import { shouldHaveRole } from './middlewares/permissions';
import { errorHandler } from './middlewares/errorHandler';
import { RoleType } from './services/users';

const router = new Router();
const shouldHaveAdminRole = shouldHaveRole([RoleType.Administrator]);

router.get('/', authMiddleware, shouldHaveAdminRole, usersControllers.getUsers);
router.post('/signup/', errorHandler, usersControllers.signup);
router.post('/signin/', errorHandler, usersControllers.signin);
router.put(
  '/users/me/changePassword',
  authMiddleware,
  errorHandler,
  usersControllers.changePassword
);
router.patch('/users/me/', authMiddleware, usersControllers.updateUser);
router.get('/users/me/', authMiddleware, errorHandler, usersControllers.currentUser);
router.post('/groups/', authMiddleware, errorHandler, groupsControllers.createGroup);
router.get('/groups/', authMiddleware, groupsControllers.getGroups);
router.post(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  groupsControllers.createGroupMember
);
router.get(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  groupsControllers.getGroupMembers
);
router.put(
  '/users/:user_id/changeRole',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  usersControllers.changeRole
);
router.delete('/users/:user_id/', authMiddleware, errorHandler, usersControllers.deleteUser);
router.post(
  '/teachers/',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  teachersControllers.createTeacher
);
router.get('/teachers/', authMiddleware, shouldHaveAdminRole, teachersControllers.getTeachers);
router.post('/lessons/', authMiddleware, shouldHaveAdminRole, lessonsControllers.createLesson);
router.get(
  '/lessons/types/',
  authMiddleware,
  shouldHaveAdminRole,
  lessonsControllers.getLessonTypes
);
router.post(
  '/lessons/:id/teachers/',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  lessonsControllers.assignTeacherToLesson
);
router.post(
  '/attachments/',
  authMiddleware,
  shouldHaveAdminRole,
  attachmentsControllers.createAttachment
);
router.delete(
  '/attachments/:id/',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  attachmentsControllers.deleteAttachment
);
router.post(
  '/groups/:group_id/lessons/',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  lessonsControllers.createGroupLesson
);
router.get(
  '/groups/:group_id/lessons/',
  authMiddleware,
  errorHandler,
  lessonsControllers.getGroupLessons
);
router.post(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id/',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  attachmentsControllers.assignToGroupLesson
);
router.get(
  '/groups/:group_id/lessons/:lesson_id/attachments/',
  authMiddleware,
  errorHandler,
  attachmentsControllers.getGroupLessonAttachment
);
router.delete(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id',
  authMiddleware,
  shouldHaveAdminRole,
  errorHandler,
  attachmentsControllers.deleteGroupLessonAttachment
);

export { router };
