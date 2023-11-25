import { Context, Next } from 'koa';
import Router from 'koa-router';
import { createAutoHubJWT } from '../../helpers/crypto.js';
import { AccessToken } from '../../types/index.js';
import { createAccessToken, findAccessTokenByName } from '../../schemas/AcessTokens.js';

const router = new Router();
const ROUTE_BASE = '/access-tokens'

router.get(`${ROUTE_BASE}`, async (ctx: Context, _next: Next) => {
  ctx.body = {
    msg: 'Hello Koa from access tokens'
  };
});


router.get(`${ROUTE_BASE}/claim-super-admin`, async (ctx: Context, _next: Next) => {
  const { TOKEN_SETUP_SECRET } = process.env
  const setupSecret = ctx.headers['art-token-setup']
  if (!setupSecret || setupSecret !== TOKEN_SETUP_SECRET) {
    return 'Invalid setup secret'
  }

  const name = 'super-admin-jwt'
  // One-time setup of super-admin token
  const existingToken = await findAccessTokenByName(name)

  if (existingToken) {
    return { msg: 'Token setup completed' }
  }

  const key = createAutoHubJWT(name)
  const newAccessToken: AccessToken = {
    key,
    name,
    endpoints: ['*']
  }

  await createAccessToken(newAccessToken) 
  ctx.body = {
    key 
  };
});

export default router;