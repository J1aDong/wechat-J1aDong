'use strict';
import mongoose from 'mongoose';
import Config from '../config/config';
import Promise from "bluebird";

// http://stackoverflow.com/questions/30105823/mongoerror-auth-failed-mongoose-connection-sting
async function Mongo()
{
    mongoose.Promise = Promise;
    mongoose.connect(Config.mongodb.url, {auth: {authdb: "admin"}});
    let db = mongoose.connection;
    let result = await connectMongo(db);
    if (result)
    {
        console.log('连接成功');
    } else
    {
        console.log('连接失败');
    }
}

/**
 * 连接mongodb
 *
 * @param db
 */
function connectMongo(db)
{
    return new Promise(function (resolve, reject)
    {
        db.on('error', function (error)
        {
            console.log(error);
            reject(error);
        });
        db.once('open', function ()
        {
            // we're connected!
            console.log("we're connected!");
            resolve(true);
        });
    });
}

export default Mongo;