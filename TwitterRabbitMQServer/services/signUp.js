var ejs = require("ejs");
var mongo = require('./mongoDatabase');
var mongoURL = "mongodb://localhost:27017/twitter";


function performSignUp(msg, callback)
{
    var res = {};
    mongo.connect(mongoURL, function(){
        var coll = mongo.collection('user_details');
         coll.insert({twitter_handle: msg.Twitter_Handle, password:msg.Password,fname:msg.First_Name,lname:msg.Last_Name,email_id:msg.Email,birth_date:msg.Birth_Date,location:msg.Location,following:msg.following,followers:msg.followers}, function(err, user){
            if (user) {
                console.log(user);
                console.log("come ccome");
                res = {"statusCode" : 200};

            }
            else {
                console.log("returned false");
                res = {"statusCode" : 401};
            }
             callback(null,res);
        });
    });
}

exports.performSignUp = performSignUp;
