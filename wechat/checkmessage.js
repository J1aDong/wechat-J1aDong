'use strict';
import mongoose from 'mongoose';
import Promise from 'bluebird';

let user = mongoose.Schema({
    userName: String,
});
let User = mongoose.model('user', user);

module.exports = async function (option)
{
    const content = option.content;
    const ctx = option.ctx;

    const fromUserName = content.FromUserName;
    const toUserName = content.ToUserName;
    const event = content.Event;
    const msgType = content.MsgType;
    const now = new Date().getTime();
    const msg = content.Content;

    // 检查用户是否存在mongo中
    // 不存在-->存储进去
    checkUserExit(fromUserName);

    // 接收到-->文本消息
    if (msgType == "text")
    {
        ctx.body = '<xml>' +
            '<ToUserName><![CDATA[' + fromUserName + ']]></ToUserName>' +
            '<FromUserName><![CDATA[' + toUserName + ']]></FromUserName>' +
            '<CreateTime>' + now + '</CreateTime>' +
            '<MsgType><![CDATA[text]]></MsgType>' +
            '<Content><![CDATA[' + '我也是' + ']]></Content>' +
            '</xml>';
    }

    if (event === 'subscribe')
    {
        if (msgType === 'event')
        {
            console.log('请求为post' + JSON.stringify(content));
            ctx.body = '<xml>' +
                '<ToUserName><![CDATA[' + fromUserName + ']]></ToUserName>' +
                '<FromUserName><![CDATA[' + toUserName + ']]></FromUserName>' +
                '<CreateTime>' + now + '</CreateTime>' +
                '<MsgType><![CDATA[text]]></MsgType>' +
                '<Content><![CDATA[' + '欢迎来到这里，愿你被世界温柔以待' + ']]></Content>' +
                '</xml>';
        }
    }

};

async function checkUserExit(fromUserName)
{
    let isUserExit = await findUser(fromUserName);
    if (!isUserExit)
    {
        console.log('用户不存在');
        let isSuccess = await saveUser(fromUserName);
        if (isSuccess)
        {
            console.log('保存用户成功');
        } else
        {
            console.log('保存用户失败')
        }
    } else
    {
        console.log('用户存在')
    }
}

function findUser(userName)
{
    return new Promise(function (resolve, reject)
    {
        User.findOne({'userName': userName}, "userName", function (err, user)
        {
            if (err)
            {
                resolve(err)
            }
            if (user)
            {
                resolve(true)
            } else
            {
                resolve(false)
            }
        })
    });
}

function saveUser(fromUserName)
{
    return new Promise(function (resolve, reject)
    {
        let user = new User({userName: fromUserName});
        user.save(function (err, user)
        {
            if (err)
                reject(err);
            if (user)
            {
                resolve(true)
            } else
            {
                reject(false)
            }
        })
    })
}
