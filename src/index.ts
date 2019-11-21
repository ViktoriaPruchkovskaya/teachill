import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Hello world' };
  await next();
});

app.use(router.routes());
app.listen(3000, () => console.log('Server started'));
