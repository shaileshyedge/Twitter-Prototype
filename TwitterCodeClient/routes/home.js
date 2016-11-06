
var ejs = require("ejs");
var mysql = require('./mysql');

function goToHomePage(req,res){

    ejs.renderFile('./views/Home.ejs',function (err,result){
     if(!err){
         res.end(result);
     }
      else{
         res.end('An error Occurred');
         console.log(err);
     }
  });
}

exports.goToHomePage = goToHomePage;