
var ejs = require("ejs");

function goToHomePageofTwitter(req,res){

    if(req.session.handle)
    {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("homePage",{handle:req.session.handle});
    }
    else
    {
        res.redirect('/');
    }
}

exports.goToHomePageofTwitter = goToHomePageofTwitter;