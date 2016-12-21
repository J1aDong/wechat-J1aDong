'use strict';

import Koa from 'koa';
import logger from 'koa-logger';
import wechat from './wechat/wechatMiddleware';
import config from './config/config';
const app = new Koa();

app.use(logger());

app.use(async(ctx, next) =>
{
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// response
app.use(wechat(config.wechat));

app.listen(8080);

console.log('Listening:8080');