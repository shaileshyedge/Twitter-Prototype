
var ejs = require("ejs");

function goToHashPage(req,res){

    ejs.renderFile('./views/HashPage.ejs',function (err,result){
        if(!err){

            res.end(result);
        }
        else{
            res.end('An error Occurred');
            console.log(err);
        }
    });
}

exports.goToHashPage = goToHashPage;