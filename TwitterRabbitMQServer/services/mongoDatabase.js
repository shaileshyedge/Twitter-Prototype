var ejs= require('ejs');
var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

pool = {
    _collections: {}
};

pool.getCollection = function (name) {
    if (!this._collections[name]) {
        this._collections[name] = db.collection(name);
    }
    return this._collections[name];
};

function connect(url,callback)
{
    MongoClient.connect(url, function(err, _db){
        if (err)
        {
            throw new Error('Could not connect: '+err);
        }
        db = _db;
        connected = true;
        callback();
    });
}

exports.collection = function (name) {
    return pool.getCollection(name);
};

exports.connect = connect;
