import Router = require('koa-router');
import { getUsers, signupController, signinController } from './controllers/users';
import { authMiddleware } from './middlewares/authentication';
import {
  createGroupController,
  getGroupsController,
  createGroupMemberController,
  getGroupMembersController,
} from './controllers/groups';

const router = new Router();

router.get('/api/', getUsers);
router.post('/api/signup', signupController);
router.post('/api/signin', signinController);
router.post('/api/groups', authMiddleware, createGroupController);
router.get('/api/groups', authMiddleware, getGroupsController);
router.post('/api/groups/:group_id/users/', authMiddleware, createGroupMemberController);
router.get('/api/groups/:group_id/users/', authMiddleware, getGroupMembersController);

export { router };
