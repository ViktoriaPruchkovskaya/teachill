import Router = require('koa-router');
import { getUsers, signupController } from './controllers/users';

const router = new Router();

router.get('/', getUsers);
router.post('/signup', signupController);

export { router };
