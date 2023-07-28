import Koa from 'koa';
import parser from 'koa-parser'
// Routers
import mainRouter from './routes/main/index.js'
import contractRouter from './routes/contracts/index.js'

import { middlewareLogger } from './logger/middleware.js';
import { logger } from './logger/logger.js';

const API_PORT = 3000
const app = new Koa();

app.use(parser())

app.use(middlewareLogger());

// ROUTERS
app.use(mainRouter.routes()).use(mainRouter.allowedMethods())
app.use(contractRouter.routes()).use(contractRouter.allowedMethods())

app.listen(API_PORT, () => {
  logger.info(`🚀 Server ready at: http://localhost:${API_PORT} 🚀\n\t⭐️⭐️⭐️⭐️⭐️`)
});