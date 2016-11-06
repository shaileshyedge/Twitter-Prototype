
var ejs = require("ejs");
var mysql = require('./mysql');
var crypto = require('crypto');
var mongo = require("../ServerScripts/Mongo");
var mq_client = require('../rpc/client');
function authenticate(req,res)
{
    var password = req.body.password;
    password = crypto.createHash("sha1").update(password).digest("HEX");
    var handle = req.body.username;
    var json_responses;
    var msg_payload = {"Twitter_Handle": handle, "Password":password,req_queue:"login"};
    mq_client.make_request('authentication_queue',msg_payload,function(err,result){
        if(result)
        {   console.log("parat ala re");
            console.log(result);
           req.session.handle = result.user.twitter_handle;
            req.session.firstName = result.user.fname;
            req.session.lastName = result.user.lname;
            if(result.code == 200)
            {
                json_responses = {"statusCode" : 200};
                res.send(json_responses);
            }
            else
            {
                json_responses = {"statusCode" : 401};
                res.send(json_responses);
            }

        }
        else
        {
            json_responses = {"statusCode" : 401};
            res.send(json_responses);
        }
    });
}



function logout(req,res){
    req.session.destroy();
    res.redirect('/');
}


exports.authenticate = authenticate;
exports.logout = logout;