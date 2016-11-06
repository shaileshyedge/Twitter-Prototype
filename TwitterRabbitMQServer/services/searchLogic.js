
var ejs = require("ejs");
var mongo = require('./mongoDatabase');
var mongoURL = "mongodb://localhost:27017/twitter";

function getHashTags(msg,callback)
{
    var res = {};
    var feed = [];
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('tweetmaster');
        var cursor =coll.find({hash_value :{$all :[msg.searchValue]}});
        cursor.each(function(err,doc){
            if(doc!=null)
            {
                feed = feed.concat(doc);
            }
            else
            {
                res.feed = feed;
                callback(null,res);
            }
        });
    });
}

function searchToFollow(msg,callback)
{
    var res = {};
    var feed = [];
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('user_details');
        var cursor =coll.find({twitter_handle :msg.searchValue});
        cursor.each(function(err,doc){
            if(doc!=null)
            {
                feed = feed.concat(doc);
            }
            else
            {
                res.feed = feed;
                callback(null,res);
            }
        });
    })
}

function getMyProfile(msg,callback)
{
    var res= {};
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('user_details');
        coll.findOne({twitter_handle :msg.Twitter_Handle},function(err,doc){
            if(!err)
            {
                res.doc = doc;
                callback(null,res);
            }
            else
            {
                console.log("Error While retrieving user's Information");
            }
        });
    })
}

function getFollowingInfo(msg,callback)
{
    var res = {};
    var feed = [];
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('user_details');
            coll.findOne({twitter_handle : msg.Twitter_Handle},function(err,doc){
                if(!err)
                {
                    var cursor = coll.find({twitter_handle : {$in: doc.following}});
                    cursor.each(function(err,user){
                        if(user!=null)
                        {
                            feed = feed.concat(user);
                        }
                        else
                        {
                            res.feed = feed;
                            callback(null,res);
                        }
                    });
                }
            });
        });
    }


function getFollowerInfo(msg,callback)
{
    var res = {};
    var feed = [];
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('user_details');
        coll.findOne({twitter_handle : msg.Twitter_Handle},function(err,doc){
            if(!err)
            {
                var cursor = coll.find({twitter_handle : {$in: doc.followers}});
                cursor.each(function(err,user){
                    if(user!=null)
                    {
                        feed = feed.concat(user);
                    }
                    else
                    {
                        res.feed = feed;
                        callback(null,res);
                    }
                });
            }
        });
    });
}


function performFollow(msg,callback)
{  console.log("cme ehre");
    var json;
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('user_details');
        coll.update({twitter_handle:msg.Twitter_Handle},{$push :{following : msg.followingHandle}},function(err,user){
            if(!err)
            {
                coll.update({twitter_handle: msg.followingHandle},{$push :{followers : msg.Twitter_Handle}},function(err,user){
                    if(!err)
                    {
                        json = {"statusCode":200};
                        console.log("Done following");
                        callback(null,json);
                    }
                });
            }
        });
    });
}
exports.getHashTags = getHashTags;
exports.searchToFollow = searchToFollow;
exports.performFollow = performFollow;
exports.getMyProfile = getMyProfile;
exports.getFollowingInfo = getFollowingInfo;
exports.getFollowerInfo = getFollowerInfo;