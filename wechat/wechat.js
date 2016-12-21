'use strict';

import Promise from "bluebird";
import HttpUtil from "../common/httpUtil";

//目前access_token的有效期通过返回的expire_in来传达，目前是7200秒之内的值

const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    accessToken: prefix + 'token',
    temporary: {
        upload: prefix + 'media/upload?',
        fetch: prefix + 'media/get?'
    },
    permanent: {
        upload: prefix + 'material/add_material?',
        fetch: prefix + 'material/get_material?',
        uploadNews: prefix + 'material/add_news?',
        uploadNewsPic: prefix + 'material/uploadimg?',
        del: prefix + 'media/del_material?',
        update: prefix + 'material/update_news?',
        count: prefix + 'material/get_materialcount?',
        batch: prefix + 'material/batchget_material?'
    },
    menu: {
        create: prefix + 'menu/create?',
        get: prefix + 'menu/get?',
        delete: prefix + 'menu/delete?',
        current: prefix + 'get_current_selfmenu_info?'
    }
};

/**
 * 构造函数
 *
 * @param opts
 * @returns {Promise.<void>}
 * @constructor
 */
async function Wechat(opts)
{
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    //js 方法传递
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    //1.先读取wechat.txt，判断expires_in是否过期
    //2.不过期取出access_token，否则请求接口获取新的access_token，并且更新expires_in

    let content = await this.getAccessToken();
    console.log("getAccessToken-->" + content);

    // jsonStr->jsO
    if (this.isValidAccessToken(content))
    {

    } else
    {
        // 得到access_token，并且存储下来
        let result = await this.fetchAccessToken();
        console.log("result-->" + JSON.stringify(result));
        this.updateAccessToken(result);
    }
}

/**
 * 通过接口获得access_token
 *
 */
Wechat.prototype.fetchAccessToken = async function ()
{
    let that = this;
    // this.fetchAccessToken()
    let params = {
        grant_type: 'client_credential',
        appid: this.appID,
        secret: this.appSecret
    };
    let content = await HttpUtil.get(api.accessToken, params);
    return content;
};

/**
 * 判断access_token是否有效
 *
 * @param data
 */
Wechat.prototype.isValidAccessToken = function (json)
{
    if (json)
    {
        json = JSON.parse(json);

        if (json.expires_in)
        {
            let now = new Date().getTime();
            // 微信2小时access_token失效，并且提早20秒更新access_token
            if (now - json.expires_in <= (7200 - 20) * 1000)
            {
                return true;
            } else
            {
                return false;
            }
        } else
        {
            return false;
        }
    } else
    {
        return false;
    }
};

/**
 * 更新access_token
 */
Wechat.prototype.updateAccessToken = async function (jso)
{
    let access_token = jso.access_token;
    let expires_in = new Date().getTime();
    let json = {
        "access_token": access_token,
        "expires_in": expires_in
    };
    let result = await this.saveAccessToken(json);
    console.log('updateAccessToken' + result);
    return result;
};

export default Wechat;