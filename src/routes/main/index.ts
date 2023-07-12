import { Context, Next } from 'koa';
import Router from 'koa-router';
const router = new Router();

router.get('/', (ctx: Context, _next: Next) => {
  ctx.body = {
    msg: 'Hello Koa live server'
  };
});

export default router;