import Router = require('koa-router');
import { getUsers, signupController, signinController } from './controllers/users';

const router = new Router();

router.get('/', getUsers);
router.post('/signup', signupController);
router.post('/signin', signinController);

export { router };
