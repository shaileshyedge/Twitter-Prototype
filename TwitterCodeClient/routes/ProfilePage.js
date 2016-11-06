
var ejs = require("ejs");

function goToSuccessPage(req,res){

    ejs.renderFile('./views/ProfilePage.ejs',function (err,result){
        if(!err){

            res.end(result);
        }
        else{
            res.end('An error Occurred');
            console.log(err);
        }
    });
}

exports.goToSuccessPage = goToSuccessPage;