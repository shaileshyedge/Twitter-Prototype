
var ejs = require("ejs");

function goToHandleSearchPage(req,res){

    ejs.renderFile('./views/UserSearchLogic.ejs',function (err,result){
        if(!err){

            res.end(result);
        }
        else{
            res.end('An error Occurred');
            console.log(err);
        }
    });
}

exports.goToHandleSearchPage = goToHandleSearchPage;