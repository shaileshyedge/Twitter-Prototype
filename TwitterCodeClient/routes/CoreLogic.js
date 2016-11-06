
var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("../ServerScripts/Mongo");
var crypto = require('crypto');
var mongoURL = "mongodb://localhost:27017/twitter";
var mq_client = require('../rpc/client')


function putTweet(req,res)
{
    var tweet = req.body.tweetValue;
    var hashTags = [];
    tweet = tweet.replace('\n', " ");
    var date = new Date();
    console.log("Date is :"+date);
    date = date.toString();
    var id = crypto.createHash("sha1").update(date).digest("HEX");
    console.log("Id is:::"+id);
    var words = tweet.split(' ');
    for (var i = 0; i < words.length; i++) {
        if (words[i].startsWith('#')) {
            var word = words[i].trim().replace('#', '');
            word = word.replace(/[^a-zA-Z ]/g, "");
            hashTags.push(word);
        }
    }

    var msg_payload = {Twitter_Handle:req.session.handle,Tweet_Id : id,First_Name:req.session.firstName,Last_Name:req.session.lastName,Comments:req.body.tweetValue,hash_value:hashTags,Date_Added:new Date(),req_queue:"putTweet"};
    mq_client.make_request('tweet_queue',msg_payload,function(err,result){
        if(result)
        {
            console.log("result after fetch is -------------"+result);
            var feed = result.feed;
            res.send(feed);
        }
        else
        {
            console.log("Error while Inserting a tweet");
        }
    });
}




function fetchTweetss(handle,callback) {
    mongo.connect(function(){
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
                    {   tweets.user_handle = req.session.handle;
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

function puthash(splitted)
{
  var max_tweet_id = "select max(tweet_id) as max from tweetmaster;"
    mysql.fetchData(function(err,result) {
        if (err)
        {
            throw err;
        }

        else
        {
            console.log(splitted);
            if ((splitted != " ") && (splitted != "")) {
                var firstword = splitted.split(" ");
                if ((firstword[0].charAt(0) != " ") && (firstword[0].charAt(0) != ""))
                {
                    inserthash(result[0].max, firstword[0]);
                }
            }
        }
    },max_tweet_id);
}

function inserthash(tweetid,hashval)
{
    var puthash = "insert into hash_tag(hash_field,tweet_id) values (' " + hashval + "'," + tweetid + ");"
    mysql.fetchData(function(err,result) {
        if (err)
        {
            throw err;
        }

        else
        {
          console.log("inserted");

        }
    },puthash);
}



function getTweets(req,res)
{
    var msg_payload = {Twitter_Handle:req.session.handle,req_queue:"getTweets"};
    mq_client.make_request('tweet_queue',msg_payload,function(err,result){
        if(result)
        {
            var feed = result.feed;
            res.send(feed);
        }
        else
        {
            console.log("Error while Inserting a tweet");
        }
    });
}




function fetchUserDtls(req,res)
{
    var json = {};
    var msg_payload = {"Twitter_Handle": req.session.handle,req_queue:"userDtls"};
    mq_client.make_request('tweet_queue',msg_payload,function(err,result){
        if(result)
        {
            console.log("Result of the fetchUserInfo is :"+result);
            console.log(result);
            json = {following_count : result.following_count,followers_count : result.followers_count,First_Name : result.First_Name,Last_Name : result.Last_Name,Twitter_Handle : result.Twitter_Handle,tweet_count : result.tweet_count};
            res.send(json);
        }
    });
}



function fetchHashTags(req,res)
{
    var msg_payload = {"searchValue": req.session.searchValue,req_queue:"findhash"};
    mq_client.make_request('search_queue',msg_payload,function(err,result){
        if(result)
        {
            console.log("Successfully retrieved hash search");
            res.send(result.feed);
        }
    });
}




function fetchToFollow(req,res)
{
    var msg_payload = {"searchValue": req.session.searchValue,req_queue:"findusers"};
    mq_client.make_request('search_queue',msg_payload,function(err,result){
        if(result)
        {
            console.log("Successfully retrieved users to follow search");
            res.send(result.feed);
        }
    });
}




function checkSearchType(req,res)
{
    var data;
    var str = req.body.search;
    if(str.toString().charAt(0) == '#')
    {
        str = str.substr(1);
        req.session.searchValue = str;
        data = {"statusCode" : 1};
    }
    else if(str.toString().charAt(0) == '@')
    {
        str = str.substr(1);
        req.session.searchValue = str;
        data = {"statusCode" : 2};
    }
    else
    {
        req.session.searchValue = str;
        data = {"statusCode" : 3};
    }

    res.send(data);
}




function FollowMe(req,res)
{
    var statusCode,json,code;
    var msg_payload = {Twitter_Handle:req.session.handle,"followingHandle": req.body.followingHandle,req_queue:"followlist"};
    mq_client.make_request('search_queue',msg_payload,function(err,result){
        if(result)
        {
            console.log("Successfully followed");
            code = result.statusCode;
            console.log("value of code is :"+code);
            json = {"statusCode" : code};
            res.send(json);
        }
    });
}





function putRetweet(req,res) {
    var date = new Date().toString();
    var id = crypto.createHash("sha1").update(date).digest("HEX");
    var msg_payload = {
        Twitter_Handle: req.session.handle,
        Tweet_Id: req.body.tweet_id,
        Date: date,
        id: id,
        First_Name: req.session.firstName,
        Last_Name: req.session.lastName,
        req_queue: "performretweet"
    };
    mq_client.make_request('tweet_queue', msg_payload, function (err, result) {
        if (result) {
            res.send(result.feed);
        }
        else {
            console.log("Error while getting self info");
        }
    });
}


function fetchfollow(req,res)
{
    console.log("In fetch follow function");
    var msg_payload = {Twitter_Handle : req.session.handle,req_queue:"followinfo"};
    mq_client.make_request('search_queue',msg_payload,function(err,result){
        if(result)
        {   console.log("came fetching who follows me");
            console.log(result.feed);
            res.send(result.feed);
        }
    });
}

function fetchfollower(req,res)
{
    console.log("In fetch follower function");
    var msg_payload = {Twitter_Handle : req.session.handle,req_queue:"followerinfo"};
    mq_client.make_request('search_queue',msg_payload,function(err,result){
        if(result)
        {
            console.log("came fetching my followers");
            console.log(result.feed);
            res.send(result.feed);
        }
    });
}


function fetchProfile(req,res)
{
    var msg_payload = {Twitter_Handle:req.session.handle,req_queue:"myprofile"};
    mq_client.make_request('search_queue',msg_payload,function(err,result){
        if(result)
        {
            res.send(result.doc);
        }
        else
        {
            console.log("Error while getting self info");
        }
    });
}


    exports.getTweets = getTweets;
    exports.puthash = puthash;
    exports.putTweet = putTweet;
    exports.fetchUserDtls = fetchUserDtls;
    exports.fetchHashTags = fetchHashTags;
    exports.checkSearchType = checkSearchType;
    exports.fetchToFollow = fetchToFollow;
    exports.FollowMe = FollowMe;
    exports.putRetweet = putRetweet;
    exports.fetchfollow = fetchfollow;
    exports.fetchfollower = fetchfollower;
    exports.fetchProfile = fetchProfile;