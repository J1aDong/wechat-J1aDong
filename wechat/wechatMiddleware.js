//generate
'use strict';

import sha1 from "sha1";
import Wechat from "./wechat";
import {parseXMLAsync, formatMessage} from "../common/commonUtil";
import Mongo from "./mongo";
import checkMessage from './checkmessage';

module.exports = function (opts)
{
    let wechat = new Wechat(opts);
    let mongo = new Mongo();

    /**
     * 微信验证
     */
    return async function (ctx, next)
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

        console.log("sha-->" + sha + ",signature-->" + signature);

        // 微信发过来的请求为GET
        if (ctx.method === 'GET')
        {
            if (sha === signature)
            {
                ctx.body = echostr + ''
            } else
            {
                ctx.body = 'wrong'
            }
        }
        // 微信发过来的请求为POST
        else if (ctx.method === 'POST')
        {
            let body = ctx.text;
            console.log('body为' + body);

            let content = await parseXMLAsync(body);

            console.log(content);

            content = formatMessage(content.xml);

            let option = {
                'content': content,
                'ctx': ctx,
                'next': next,
            };

            checkMessage(option);

        }
    }
};