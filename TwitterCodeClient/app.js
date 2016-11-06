var express = require('express');
var app = express();
var path = require('path');

var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./ServerScripts/Mongo");
var session = require('client-sessions');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var home = require('./routes/home');
var Authentication = require('./routes/Authentication');
var ProfilePage = require('./routes/ProfilePage');
var homePage = require('./routes/homePage');
var CoreLogic = require('./routes/CoreLogic');
var hashPage = require('./routes/hashPage');
var routes = require('./routes/index');
var users = require('./routes/users');
var signUp = require('./routes/signUp');
var UserSearchLogic = require('./routes/UserSearchLogic');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port',3000);
app.use(expressSession({
  secret: '$@n-j05e-5+@+e-un!ver5!+y',
  resave: false,  //don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  duration: 30* 60 *1000,
  activeDuration: 5*60*1000,
  store: new mongoStore({
    url: "mongodb://localhost:27017/twitter"
  })
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/',home.goToHomePage);
app.get('/signUp',signUp.goToSignUpPage);
app.post('/authenticate',Authentication.authenticate);
app.post('/performSignUp',signUp.performSignUp);
app.get('/homePage',homePage.goToHomePageofTwitter);
app.post('/logout',Authentication.logout);
app.get('/ProfilePage',ProfilePage.goToSuccessPage);
app.post('/putTweet',CoreLogic.putTweet);
app.get('/getTweets',CoreLogic.getTweets);
app.get('/fetchUserDtls',CoreLogic.fetchUserDtls);
app.post('/checkSearchType',CoreLogic.checkSearchType);
app.get('/goToHashPage',hashPage.goToHashPage);
app.get('/fetchHashTags',CoreLogic.fetchHashTags);
app.get('/fetchfollow',CoreLogic.fetchfollow);
app.get('/fetchfollower',CoreLogic.fetchfollower);
app.get('/fetchToFollow',CoreLogic.fetchToFollow);
app.get('/fetchProfile',CoreLogic.fetchProfile);
app.get('/UserSearchLogic',UserSearchLogic.goToHandleSearchPage);
app.post('/FollowMe',CoreLogic.FollowMe);
app.post('/putRetweet',CoreLogic.putRetweet);
/*app.use('/', routes);
app.use('/users', users);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

http.createServer(app).listen(app.get('port'),function(){
  console.log("Server created and listening successfully on Port :"+app.get('port'));
})
module.exports = app;
