'use strict';

import config from './../config/config';
import Wechat from './../wechat/wechat';
import menu from './menu';
let wechatApi = new Wechat(config.wechat);

wechatApi.deleteMenu().then(function ()
{
    return wechatApi.createMenu(menu)
}).then(function (msg)
{
    console.log(msg)
});

exports.reply = async function (next)
{
    let message = this.weixin;
    console.log(message);
    if (message.MsgType === 'event')
    {
        if (message.Event === 'subscribe')
        {
            if (message.EventKey)
            {
                console.log('扫描二维码进来:' + message.EventKey + '' + message.ticket)
            }

            this.body = '欢迎订阅此号'
        }
        else if (message.Event === 'unsubscribe')
        {
            console.log('无情取关')
            this.body = ''
        } else if (message.Event === 'LOCATION')
        {
            this.body = '您上报的位置是: ' + message.Latitude + '/' + message.Longtitude + '-' + message.Precision
        } else if (message.Event === 'CLICK')
        {
            this.body = '您点击了菜单:' + message.EventKey
        } else if (message.Event === 'SCAN')
        {
            console.log('关注后扫二维码' + message.EventKey + ' ' + message.Ticket)
            this.body = '看到你扫一下哦'
        } else if (message.Event === 'VIEW')
        {
            this.body = '您点击了菜单中的链接: ' + message.EventKey
        }
    }
    else if (message.MsgType === 'text')
    {
        var content = message.Content
        var reply = '额,你说的 ' + message.Content + '太复杂了'

        if (content === '1')
        {
            reply = 'android'
        } else if (content === '2')
        {
            reply = 'ios'
        } else if (content === '3')
        {
            reply = 'web'
        } else if (content === '4')
        {
            reply = [{
                title: '技术改变命运',
                description: '只是个描述',
                picUrl: 'http://img.yayawan.com/upload/2015/04/120a8732d6.jpg',
                url: 'https://github.com/'
            }]
        } else if (content === '5')
        {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg')

            reply = {
                type: 'image',
                mediaId: data.media_id
            }
            console.log(reply)
        } else if (content === '6')
        {
            var data = yield wechatApi.uploadMaterial('video', __dirname + '/6.mp4')

            reply = {
                type: 'video',
                title: '回复视频内容',
                description: '打个视频玩玩',
                mediaId: data.media_id
            }
        } else if (content === '7')
        {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg')

            reply = {
                type: 'music',
                title: '回复音乐内容',
                description: 'music',
                musicUrl: 'http://mpge.5nd.com/2010/2010b/2013-11-25/61476/1.mp3',
                mediaId: data.media_id
            }

            console.log(reply)
        } else if (content === '8')
        {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg', {type: 'image'})

            reply = {
                type: 'image',
                mediaId: data.media_id
            }

            console.log(reply)
        } else if (content === '9')
        {
            var picData = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg', {})

            var media = {
                articles: [{
                    title: 'hary',
                    thumbMediaId: picData.media_id,
                    author: 'Scccc',
                    digest: '摘要',
                    show_cover_pic: 1,
                    content: '内容',
                    content_source_url: 'https://github.com'
                }]
            }

            data = yield wechatApi.uploadMaterial('news', media, {})
            data = yield wechatApi.fetchMaterial(data.media_id, "news", {})

            console.log('data-->' + data);

            var items = data.news_item;
            var news = [];

            items.forEach(function (item)
            {
                news.push({
                    title: item.title,
                    description: item.digest,
                    picUrl: picData.url,
                    url: item.url
                })
            });

            reply = news
        }

        this.body = reply
    }

    await next()
};