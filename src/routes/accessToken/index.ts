import { Context, Next } from "koa";
import Router from "koa-router";
import { createAutoHubJWT } from "../../helpers/crypto.js";
import { AccessToken, RouteStructure } from "../../types/index.js";
import {
  createAccessToken,
  findAccessTokenByName,
} from "../../schemas/AcessTokens.js";

const router = new Router();
const ROUTE_BASE = "/access-tokens";

export const allRoutes: RouteStructure = {
  [ROUTE_BASE]: {
    path: ROUTE_BASE,
    method: "GET",
    auth: true,
  },
  [`${ROUTE_BASE}/claim-super-admin`]: {
    path: `${ROUTE_BASE}/claim-super-admin`,
    method: "GET",
    auth: false,
  },
};

router.get(allRoutes[ROUTE_BASE].path, async (ctx: Context, next: Next) => {
  ctx.body = {
    msg: "Hello Koa from access tokens",
  };
  return next();
});

router.get(
  allRoutes[`${ROUTE_BASE}/claim-super-admin`].path,
  async (ctx: Context, next: Next) => {
    const { TOKEN_SETUP_SECRET } = process.env;
    const setupSecret = ctx.headers["art-token-setup"];
    if (!setupSecret || setupSecret !== TOKEN_SETUP_SECRET) {
      ctx.response.status = 400;
      ctx.response.message = "Invalid setup secret";
      return next();
    }

    const name = "super-admin-jwt";
    // One-time setup of super-admin token
    const existingToken = await findAccessTokenByName(name);

    if (existingToken) {
      ctx.body = { msg: "Token setup completed" };
      return next();
    }

    const key = createAutoHubJWT(name);
    const newAccessToken: AccessToken = {
      key,
      name,
      endpoints: ["*"],
    };

    await createAccessToken(newAccessToken);
    ctx.body = {
      key,
    };
    return next();
  }
);

export default router;
