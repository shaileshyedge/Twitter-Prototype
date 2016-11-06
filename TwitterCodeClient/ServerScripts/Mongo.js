/**
 * Created by SHAILESH-PC on 4/4/2016.
 */
/*
var MongoClient = require('mongodb').MongoClient;
var mongoSessionConnectURL = "mongodb://localhost:27017/twitter";
var db;
var connected = false;

exports.connect = function( callback){
    MongoClient.connect(mongoSessionConnectURL, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log(connected +" is connected?");
        callback(db);
    });
};

exports.collection = function(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);

};
*/