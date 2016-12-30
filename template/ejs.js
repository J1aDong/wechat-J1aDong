'use strict';

import ejs from 'ejs';
import heredoc from 'heredoc';

let tpl = heredoc(function ()
{/*
 <xml>
 <ToUserName><![CDATA[% toUser %]]></ToUserName>
 <FromUserName><![CDATA[% fromUser %]]></FromUserName>
 <CreateTime>{% createTime %}</CreateTime>
 <MsgType><![CDATA[{% msgType %}]]></MsgType>
 <Content><![CDATA[{% content %}]]></Content>
 </xml>
 */
});


