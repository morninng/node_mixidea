var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var url = require('url');
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });



var index = require('./routes/index');
//var users = require('./routes/users');
var admin = require('./routes/admin');
console.log("test");
var app = express();

app.use(compression());
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');


app.use(function(req, res, next) {
    if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
    }
    else
        next();
});

const ogp_generate = require("./lib/ogp_generate.js");

app.use(function(req, res, next){


  const user_agent = req.headers['user-agent']
  console.log("user agent", user_agent);  
  if(user_agent.indexOf("facebookexternalhit/1.1") === 0){
    console.log("the user agent is facebook");
    console.log("request url", req.url);
    const full_url = 'https://' + req.headers.host + req.url;
    const response_htmle = ogp_generate.respond_ogp(req, res, next, full_url, req.url);
    return;
  }else{
    next();
  }

})


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/users', users);
app.use('/admin', admin);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
