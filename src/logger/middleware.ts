import { Context, Next } from "koa";

export function middlewareLogger(format: string = ':method ":url"') {
  return async function (ctx: Context, next: Next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);

    console.log(str);

    await next();
  };
}