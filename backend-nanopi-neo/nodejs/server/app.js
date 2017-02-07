import Koa from 'koa';
import cors from 'kcors';
import convert from 'koa-convert';
import body from 'koa-json-body';
import serve from 'koa-static2';
import config from './config';
import router from './router';

const app = new Koa()
  .use(convert(cors()))
  .use(body())
  .use(serve(config.imagedir))
  .use(router.routes())
  .use(router.allowedMethods());

export default app;