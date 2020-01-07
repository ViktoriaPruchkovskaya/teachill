import Router = require('koa-router');
import { getUsers, addUser } from './controllers/indexController';

const router = new Router();

router.get('/', getUsers);
router.post('/', addUser);

export { router };
