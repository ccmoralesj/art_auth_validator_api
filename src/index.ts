import Koa from "koa";
import parser from "koa-parser";
import cors from "@koa/cors";
import dotenv from "dotenv";
dotenv.config();
// Routers
import mainRouter from "./routes/main/index.js";
import validatorsRouter from "./routes/validators/index.js";
import accessTokensRouter from "./routes/accessToken/index.js";

import { middlewareLogger } from "./logger/middleware.js";
import { logger } from "./logger/logger.js";
import { middlewareAuth } from "./services/middlewares/auth.js";
import "./helpers/whiteListRoutes.js";
import { WHITE_LIST_ORIGINS } from "./helpers/consts/index.js";

const API_PORT = process.env.PORT;
const app = new Koa();

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URI];

const options = {
  origin(ctx) {
    const originFound = WHITE_LIST_ORIGINS.find((url) => url === ctx.url);
    logger.info({ originFound, WHITE_LIST_ORIGINS });
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

app.use(middlewareAuth);

// ROUTERS
app.use(mainRouter.routes()).use(mainRouter.allowedMethods());
app.use(validatorsRouter.routes()).use(validatorsRouter.allowedMethods());
app.use(accessTokensRouter.routes()).use(accessTokensRouter.allowedMethods());

app.listen(API_PORT, () => {
  logger.info(
    `🚀 Server ready at: http://localhost:${API_PORT} 🚀\n\t⭐️⭐️⭐️⭐️⭐️`
  );
});
