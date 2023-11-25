import { Context, Next } from 'koa';
import Router from 'koa-router';
import { RouteStructure } from '../../types/index.js';

const router = new Router();
const ROUTE_BASE = '/'

export const allRoutes: RouteStructure  = {
  [ROUTE_BASE]: {
    path: ROUTE_BASE,
    method: 'GET',
    auth: false
  }
}

router.get(allRoutes[ROUTE_BASE].path, (ctx: Context, _next: Next) => {
  ctx.body = {
    msg: 'Hello Koa live server'
  };
});

export default router;