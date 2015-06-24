var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var register = require('./routes/register')
var login = require('./routes/login')
var reply = require('./routes/reply')
var user = require('./middleware/user')
var messages = require('./lib/messages')
var entry = require('./routes/entry')
var proxy = require("./proxy/main")
var User = proxy.User
var Reply = proxy.Reply
var Entry = proxy.Entry  
var validate = require('./middleware/validate')
var statistics = require('./middleware/statistics')
var page = require('./middleware/page')

var app = express();
app.use(session({secret: 'mexiqq'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(user)
app.use(messages)

// get  
app.get('/entry/:id',entry.full)
app.get('/register',register.form)
app.get('/login',login.form)
app.get('/logout',login.logout)
app.get('/post',entry.form)
app.get('/active_acount',login.activeAcount)

// post
app.post('/register',validate.required('login_name'),validate.lengthAbove('login_name',4),validate.required('email'),validate.emailConfirm(),validate.passConfirm(),register.submit)
app.post('/login',login.submit)
app.post('/post',validate.required('title'),validate.lengthAbove('title',4),entry.submit)
app.post('/reply',reply.submit)

app.use('/entries/:page?',page(Entry.getCount,25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),entry.list);

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


module.exports = app;

