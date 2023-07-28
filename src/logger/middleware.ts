import { Context, Next } from "koa";
import { logger } from "./logger.js";

export function middlewareLogger(format: string = ':method > :url') {
  return async function (ctx: Context, next: Next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);

    logger.info(str);

    await next();
  };
}