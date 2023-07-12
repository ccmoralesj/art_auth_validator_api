import Koa from 'koa';
import parser from 'koa-parser'

import mainRouter from './routes/main/index.js'

const API_PORT = 3000
const app = new Koa();

app.use(parser())

// ROUTERS
app.use(mainRouter.routes()).use(mainRouter.allowedMethods())

app.listen(API_PORT, () => {
  console.log(`API ready and listening from port: ${API_PORT}`)
});