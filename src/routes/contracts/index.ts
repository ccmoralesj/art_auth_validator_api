import { Context, Next } from 'koa';
import Router from 'koa-router';
import { logger } from '../../logger/logger.js';
const router = new Router();
const ENDPOINT_BASE = 'contracts'

router.post(`/${ENDPOINT_BASE}`, (ctx: Context, _next: Next) => {
  logger.info('[POST] Contract')
  logger.info({ yell: true, message: 'The Body' })
  logger.info({ body: ctx.request.body })
  ctx.body = {
    msg: 'Well done!'
  };
});

export default router;