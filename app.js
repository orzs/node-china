var express = require('express');
var express_session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var RedisStore = require('connect-redis')(express_session);
var redis = require('redis');
var rClient = redis.createClient();

var app = express();

/*
 * view engine 
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
 * middleware
 */
//uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
 * session save 
 */

var session = express_session({
  cookie:{
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 3*24*60*6000
  },
  secret: 'node-china_dev',
  saveUninitialized: false,
  name: 'node-china.id',
  resave: true,
  store: new RedisStore({client:rClient})
});

app.use(session);

/*
 * custome middleware
 */
var messages = require('./lib/messages')
var user = require('./middleware/user')
app.use(user)
app.use(messages)

/*
 * routers 
 */
var routes = require('./routes/index');
app.use('/',routes);

 /*
  * catch 404 and forward to error handler
  */ 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
 * will print stacktrace
 * development error handler
 */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('base/error', {
      message: err.message,
      error: err
    });
  });
}

/*
 * production error handler
 * no stacktraces leaked to user
 */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('base/error', {
    message: err.message,
    error: {}
  });
});

app.channel = 'chat';
app.session = session;

module.exports = app;

