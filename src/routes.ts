import Router = require('koa-router');
import * as usersControllers from './controllers/users';
import * as groupsControllers from './controllers/groups';
import * as teachersControllers from './controllers/teachers';
import * as attachmentsControllers from './controllers/attachments';
import * as lessonsControllers from './controllers/lessons';
import { authMiddleware } from './middlewares/authentication';
import { shouldHaveRole } from './middlewares/permissions';
import { RoleType } from './services/users';

const router = new Router();
const shouldHaveAdminRole = shouldHaveRole([RoleType.Administrator]);

router.get('/', authMiddleware, shouldHaveAdminRole, usersControllers.getUsers);
router.post('/signup/', usersControllers.signup);
router.post('/signin/', usersControllers.signin);
router.put('/users/me/changePassword', authMiddleware, usersControllers.changePassword);
router.patch('/users/me/', authMiddleware, usersControllers.updateUser);
router.get('/users/me/', authMiddleware, usersControllers.currentUser);
router.post('/groups/', authMiddleware, groupsControllers.createGroup);
router.get('/groups/', authMiddleware, groupsControllers.getGroups);
router.post(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveAdminRole,
  groupsControllers.createGroupMember
);
router.get(
  '/groups/:group_id/users/',
  authMiddleware,
  shouldHaveAdminRole,
  groupsControllers.getGroupMembers
);
router.put(
  '/users/:user_id/changeRole',
  authMiddleware,
  shouldHaveAdminRole,
  usersControllers.changeRole
);
router.delete('/users/:user_id/', authMiddleware, usersControllers.deleteUser);
router.post('/teachers/', authMiddleware, shouldHaveAdminRole, teachersControllers.createTeacher);
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
  attachmentsControllers.deleteAttachment
);
router.post(
  '/groups/:group_id/lessons/',
  authMiddleware,
  shouldHaveAdminRole,
  lessonsControllers.assignLessonToGroup
);
router.get('/groups/:group_id/lessons/', authMiddleware, lessonsControllers.getGroupLessons);
router.post(
  '/groups/:group_id/lessons/:lesson_id/attachments/:attachment_id/',
  authMiddleware,
  shouldHaveAdminRole,
  attachmentsControllers.assignToGroupLesson
);
router.get(
  '/groups/:group_id/lessons/:lesson_id/attachments/',
  authMiddleware,
  attachmentsControllers.getLessonAttachments
);
router.patch(
  '/attachments/:attachment_id',
  authMiddleware,
  shouldHaveAdminRole,
  attachmentsControllers.editAttachment
);
export { router };
