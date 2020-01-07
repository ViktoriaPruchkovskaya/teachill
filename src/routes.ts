import Router = require('koa-router');
import { addUser } from './controllers/indexController';

const router = new Router();

router.post('/', addUser);

export { router };
