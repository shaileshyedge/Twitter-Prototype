var ejs = require("ejs");
var mongo = require('./mongoDatabase');
    var mongoURL = "mongodb://localhost:27017/twitter";

function summaryDtls(msg,callback)
{
    var res = {};
    mongo.connect(mongoURL, function(){
        var coll = mongo.collection('user_details');
        var cursor =coll.find({twitter_handle : msg.Twitter_Handle});
        cursor.each(function(err,user){
            if(user!= null)
            {
                res = {following_count: user.following.length, followers_count: user.followers.length,First_Name : user.fname,Last_Name:user.lname,Twitter_Handle:user.twitter_handle};
                var coll1 = mongo.collection('tweetmaster');
                coll1.find({twitter_handle:  msg.Twitter_Handle}).toArray(function (err, doc) {
                    res.tweet_count = doc.length;
                    callback(null,res);

                });
            }
        });

    });
}


function putRetweet(msg,callback)
{
    mongo.connect(mongoURL, function() {
        var res = {};
        var coll = mongo.collection('tweetmaster');
        coll.findOne({tweet_id : msg.Tweet_Id},function(err,tweet){
            if(!err)
            {
                var Comments = tweet.tweet_text;
                coll.insert({twitter_handle : msg.Twitter_Handle,tweet_id : msg.id,fname : msg.First_Name,lname : msg.Last_Name,tweet_text: Comments,hash_value :[],Date_Added : new Date()},function(err,user){
                    if(!err)
                    {
                        getthetweets(msg.Twitter_Handle,function(feed) {
                            res.feed = feed;
                            callback(null, res);
                        });
                    }
                    else
                    {
                        console.log("Error While Inserting ReTweeted Comment");
                    }
                });
            }
        });
    })
}

function putTweet(msg, callback)
{
    var res = {};
    mongo.connect(mongoURL, function(){
        var coll = mongo.collection('tweetmaster');
        coll.insert({twitter_handle:msg.Twitter_Handle,tweet_id : msg.Tweet_Id,fname:msg.First_Name,lname:msg.Last_Name,tweet_text:msg.Comments,hash_value:msg.hash_value,date_added:msg.Date_Added}, function(err, tweet){
            if (tweet)
            {
                getthetweets(msg.Twitter_Handle,function(feed){
                    res.feed = feed;
                    callback(null,res);
                });

            }
            else
            {
                console.log("returned false");
            }

        });
    })
}

function getTweets(msg,callback)
{
    var res = {};
    getthetweets(msg.Twitter_Handle,function (feed) {
        res.feed = feed;
        callback(null, res);
    });
}

function getthetweets(handle,callback) {
    mongo.connect(mongoURL, function(){
        var feed = [];
        var coll = mongo.collection('user_details');
        var cursor = mongo.collection("user_details").find({"twitter_handle": handle});
        cursor.each(function (err, doc) {
            if(doc!= null)
            {
                var followingCursor = mongo.collection("tweetmaster").find({$or:[{twitter_handle :handle},{twitter_handle: {$in: doc.following}}]});
                followingCursor.each(function (err, tweets)
                {
                    if (tweets != null)
                    {    tweets.user_handle = handle;
                        feed = feed.concat(tweets);
                    }
                    else
                    {
                        callback(feed);
                    }
                });

            }
        });
    });
}



exports.summaryDtls = summaryDtls;
exports.putTweet = putTweet;
exports.getTweets = getTweets;
exports.putRetweet = putRetweet;