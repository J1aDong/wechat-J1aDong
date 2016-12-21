//generate
'use strict';

import sha1 from 'sha1';
import Wechat from './wechat';

module.exports = function (opts)
{
    let wechat = new Wechat(opts);

    /**
     * 微信验证
     */
    return function async(ctx, next)
    {
        /**
         * 微信验证
         *
         * 1）将token、timestamp、nonce三个参数进行字典序排序
         * 2）将三个参数字符串拼接成一个字符串进行sha1加密
         * 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
         */
        const token = opts.token;
        const signature = ctx.query.signature;
        const nonce = ctx.query.nonce;
        const timestamp = ctx.query.timestamp;
        const echostr = ctx.query.echostr;

        let str = [token, timestamp, nonce].sort().join('');
        let sha = sha1(str);

        console.log("str-->" + str + ",signature-->" + signature);

        if (sha === signature)
        {
            ctx.body = echostr + ''
        } else
        {
            ctx.body = 'wrong'
        }
    }
};