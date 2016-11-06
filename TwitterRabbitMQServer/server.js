/**
 * Created by SHAILESH-PC on 4/12/2016.
 */
var amqp = require('amqp')
    , util = require('util');

var auth = require('./services/Authenticate');
var signUp = require('./services/signUp');
var tweet = require('./services/CoreLogic');
var searchinfo = require('./services/searchLogic');
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
    console.log("listening on login_queue");

    cnn.queue('authentication_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            switch (message.req_queue)
            {
                case "login" :
                    auth.LoginCheck(message,function(err,res){
                        cnn.publish(m.replyTo, res, {
                            contentType:'application/json',
                            contentEncoding:'utf-8',
                            correlationId:m.correlationId
                        });
                    });break;
                case "signUp" : signUp.performSignUp(message,function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
                    break;
            }

        });
    });



    cnn.queue('tweet_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            switch (message.req_queue)
            {
                case "userDtls" : tweet.summaryDtls(message,function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
                    break;
                case "putTweet" :tweet.putTweet(message,function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
                    break;
                case "getTweets" :tweet.getTweets(message,function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
                    break;

                case "performretweet" :tweet.putRetweet(message,function(err,res){
                    cnn.publish(m.replyTo, res, {
                        contentType:'application/json',
                        contentEncoding:'utf-8',
                        correlationId:m.correlationId
                    });
                });
                    break;
            }

        });
    });




    cnn.queue('search_queue', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m){
            util.log(util.format( deliveryInfo.routingKey, message));
            util.log("Message: "+JSON.stringify(message));
            util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
            switch (message.req_queue)
            {
                case "findhash" :
                    searchinfo.getHashTags(message,function(err,res){
                        cnn.publish(m.replyTo, res, {
                            contentType:'application/json',
                            contentEncoding:'utf-8',
                            correlationId:m.correlationId
                        });
                    });
                    break;

                case "findusers" :
                    searchinfo.searchToFollow(message,function(err,res){
                        cnn.publish(m.replyTo, res, {
                            contentType:'application/json',
                            contentEncoding:'utf-8',
                            correlationId:m.correlationId
                        });
                    });
                    break;

                case "followlist" :
                    searchinfo.performFollow(message,function(err,res){
                        cnn.publish(m.replyTo, res, {
                            contentType:'application/json',
                            contentEncoding:'utf-8',
                            correlationId:m.correlationId
                        });
                    });
                    break;

                case "myprofile" :
                    searchinfo.getMyProfile(message,function(err,res){
                        cnn.publish(m.replyTo, res, {
                            contentType:'application/json',
                            contentEncoding:'utf-8',
                            correlationId:m.correlationId
                        });
                    });
                    break;

                case "followinfo" :
                    searchinfo.getFollowingInfo(message,function(err,res){
                        cnn.publish(m.replyTo, res, {
                            contentType:'application/json',
                            contentEncoding:'utf-8',
                            correlationId:m.correlationId
                        });
                    });
                    break;

                case "followerinfo" :
                    searchinfo.getFollowerInfo(message,function(err,res){
                        cnn.publish(m.replyTo, res, {
                            contentType:'application/json',
                            contentEncoding:'utf-8',
                            correlationId:m.correlationId
                        });
                    });
                    break;

            }

        });
    });

});
