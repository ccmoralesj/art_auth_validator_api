import { Context, Next } from "koa";
import { logger } from "./logger.js";

export function middlewareLogger(format: string = ":method > :url") {
  return async function (ctx: Context, next: Next) {
    const str = format.replace(":method", ctx.method).replace(":url", ctx.url);

    logger.info(str);

    await next();
  };
}
export function middlewareLoggerResponse(
  format: string = "Response > :status :message"
) {
  return async function (ctx: Context, next: Next) {
    const str = format
      .replace(":status", `${ctx.response.status}`)
      .replace(
        ":message",
        `${ctx.response.message ? ctx.response.message : ""}`
      );

    logger.info(str);

    await next();
  };
}
