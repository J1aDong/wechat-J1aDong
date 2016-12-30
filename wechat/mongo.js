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
    // 连接错误
    let result = await connectMongo(db);
    if (result)
    {
        let kittySchema = mongoose.Schema({
            name: String
        });
        let Kitten = mongoose.model('Kitten', kittySchema);
        let silence = new Kitten({name: 'Silence'});
        silence.save(function (err, silence)
        {
            if (err) return console.error(err);
            if (silence) console.log(silence);
        })
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