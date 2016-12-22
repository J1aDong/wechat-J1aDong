'use strict';

import Koa from 'koa';
import logger from 'koa-logger';
import wechat from './wechat/wechatMiddleware';
import getRawBody from 'raw-body';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import config from './config/config';
const app = new Koa();

// 为了兼容co的写法
// ---------- override app.use method ----------
const _use = app.use;
app.use = x => _use.call(app, convert(x));

// 打印日志的中间件
app.use(logger());

// 将请求的xml body转成string
app.use(async(ctx, next) =>
{
    ctx.text = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.encoding
    });
    await next();
});

// bodyParser中间件用来解析http请求体
app.use(bodyParser());


// 微信自定义中间件
app.use(wechat(config.wechat));

// 监听8080端口，配合nginx来映射到80端口
app.listen(parseInt(process.env.PORT) || 8080);

console.log('Listening:32768');