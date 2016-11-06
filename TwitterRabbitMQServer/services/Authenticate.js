var ejs = require("ejs");
var mongo = require('./mongoDatabase');
var mongoURL = "mongodb://localhost:27017/twitter";

function LoginCheck(msg, callback){

	var res = {};
	console.log("hitche ala");
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('user_details');
		coll.findOne({twitter_handle: msg.Twitter_Handle, password: msg.Password}, function (err, user) {
			if (user) {
				console.log("login success");
				res.code = "200";
				res.user = user;
			}
			else {
				console.log("login failed");
				res.code = "401";
			}
			callback(null, res);
		});
	});
}

exports.LoginCheck = LoginCheck;