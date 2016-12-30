'use strict';

import util from '../common/fileUtil';
import path  from'path';
const wechat_file = path.join(__dirname, './wechat.txt');

const config = {
    wechat: {
        appID: 'wx508000eeda7c785c',
        appSecret: '913c41d5155ce8eb4b685228a736b37e',
        token: '991383877',
        getAccessToken: function ()
        {
            return util.readFileAsync(wechat_file, 'utf-8');
        },
        saveAccessToken: function (data)
        {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        }
    },
    mongodb: {
        url: "mongodb://admin:GL1Xy1tiI6KJ@118.178.186.169:27017/weixin"
    }
};

export default config;