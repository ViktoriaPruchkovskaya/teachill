import Router = require('koa-router');
import { getUsers, signupController, signinController } from './controllers/users';
import { authMiddleware } from './middlewares/authentication';
import { createGroupController } from './controllers/education';

const router = new Router();

router.get('/', getUsers);
router.post('/signup', signupController);
router.post('/signin', signinController);
router.post('/groups', authMiddleware, createGroupController);

export { router };
