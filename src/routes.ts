import Router = require('koa-router');
import { getUsers, signupController, signinController } from './controllers/users';
import { authMiddleware } from './middlewares/authentication';
import { createGroupController } from './controllers/education';
import { createTeacherController, getTeachersController } from './controllers/teachers';
import { createLessonController } from './controllers/lessons';

const router = new Router();

router.get('/', getUsers);
router.post('/signup', signupController);
router.post('/signin', signinController);
router.post('/groups', authMiddleware, createGroupController);
router.post('/api/teachers/', authMiddleware, createTeacherController);
router.get('/api/teachers/', authMiddleware, getTeachersController);
router.post('/api/lessons/', authMiddleware, createLessonController);

export { router };
