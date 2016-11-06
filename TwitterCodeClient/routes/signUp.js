var ejs = require("ejs");
var mysql = require('./mysql');
var crypto = require('crypto');
var mongo = require("../ServerScripts/Mongo");
var mq_client = require('../rpc/client');
//var mongoURL = "mongodb://localhost:27017/login";

function goToSignUpPage(req, res) {
    ejs.renderFile('./views/SignUp.ejs', function (err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error Occurred');
            console.log(err);
        }
    });
}



function performSignUp(req,res) {
    console.log("here");
    var password = req.body.password;
    password = crypto.createHash("sha1").update(password).digest("HEX");
    var handle = req.body.handle;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var dateOfBirth = req.body.dateOfBirth;
    var location = req.body.location;
    var json_responses;
    var code;
    var msg_payload = {
        Twitter_Handle: handle,
        Password: password,
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Birth_Date: dateOfBirth,
        Location: location,
        following: [],
        followers: [],
        req_queue: "signUp"
    };

    mq_client.make_request('auth_queue', msg_payload, function (err, result) {
        if (result) {
            code = result.statusCode;
            json_responses = {statusCode: code};
            res.send(json_responses);
        }
        else {
            var statusCode = result.statusCode;
            json_responses = {statusCode: statusCode};
            res.send(json_responses);
        }
    });

}
    exports.goToSignUpPage = goToSignUpPage;
    exports.performSignUp = performSignUp;
