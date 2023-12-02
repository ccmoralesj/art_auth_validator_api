import Koa from "koa";
import parser from "koa-parser";
import cors from "@koa/cors";
import dotenv from "dotenv";
dotenv.config();
// Routers
import mainRouter from "./routes/main/index.js";
import validatorsRouter from "./routes/validators/index.js";
import accessTokensRouter from "./routes/accessToken/index.js";

import {
  middlewareLogger,
  middlewareLoggerResponse,
} from "./logger/middleware.js";
import { logger } from "./logger/logger.js";
import { middlewareAuth } from "./services/middlewares/auth.js";
import { fillWhiteListOrigins } from "./helpers/whiteListOrigins.js";
import { WHITE_LIST_ORIGINS } from "./helpers/consts/index.js";
import "./helpers/whiteListRoutes.js";
import { generateConnection } from "./services/supabase/connection.js";

// Fill the White List Origins with ENV VARS
fillWhiteListOrigins();
// SetupDB
generateConnection();

const API_PORT = process.env.PORT;
const app = new Koa();

const options = {
  origin(ctx) {
    const originFound = WHITE_LIST_ORIGINS.find(
      (origin) => origin === ctx.origin
    );
    // logger.info({ ctxURL: ctx.origin, originFound, WHITE_LIST_ORIGINS });
    if (originFound) {
      return true;
    }
    return false;
  },
};

// Then pass these options to cors:
app.use(cors(options));

app.use(parser());

app.use(middlewareLogger());

// Logger entry
app.use(middlewareAuth);

// ROUTERS
app.use(mainRouter.routes()).use(mainRouter.allowedMethods());
app.use(validatorsRouter.routes()).use(validatorsRouter.allowedMethods());
app.use(accessTokensRouter.routes()).use(accessTokensRouter.allowedMethods());

// Logger repsonse
app.use(middlewareLoggerResponse());

app.listen(API_PORT, () => {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `http://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${API_PORT}`;
  const helloMessage = `🚀 Server ready at: ${domain} 🚀\n\t⭐️⭐️⭐️⭐️⭐️`;
  logger.info(helloMessage);
});
