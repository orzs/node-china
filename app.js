var express = require('express');
var multer = require('multer')
var session = require('express-session')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var RedisStore = require('connect-redis')(session)

var routes = require('./routes/index');
var register = require('./routes/register')
var login = require('./routes/login')
var reply = require('./routes/reply')
var entry = require('./routes/entry')
var tab = require('./routes/tab')
var account = require('./routes/user')

var proxy = require("./proxy/main")
var User = proxy.User
var Reply = proxy.Reply
var Entry = proxy.Entry  

var messages = require('./lib/messages')
var validate = require('./middleware/validate')
var statistics = require('./middleware/statistics')
var page = require('./middleware/page')
var user = require('./middleware/user')

var app = express();
app.use(session({
  cookie: { 
    path: '/', 
    httpOnly: true,
    secure: false, 
    maxAge: 3*24*60*6000 
  },
  secret: 'node-china_dev',
  saveUninitialized: false,
  name: 'node-china.id',
  resave: true,
  store: new RedisStore({
    host: '127.0.0.1',
    post: '6379'
  })
}));

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
app.get('/tabs',tab.getTabsJson)
app.get('/user/edit',account.form)
app.get('/user/:login_name/entries',account.showWithEntries)
app.get('/user/:login_name/favorites',account.showWithFavorites)
app.get('/user/:login_name/followers',account.showWithFollowers)
app.get('/user/:login_name/following',account.showWithFollowing)
app.get('/user/:login_name/blocked',account.showWithBlocked)
app.get('/user/:login_name',account.show)

// post
app.post('/entry/:id/collect',account.collectEntry)
app.post('/entry/:id/de_collect',account.decollectEntry)
app.post('/entry/:id/like',account.enjoyEntry);
app.post('/entry/:id/de_like',account.cancelEnjoyEntry);
app.post('/entry/:id/follow',account.attenteEntry);
app.post('/entry/:id/de_follow',account.cancelAttenteEntry);
app.post('/reply/:id/like',account.enjoyReply);
app.post('/reply/:id/de_like',account.cancelEnjoyReply);

app.post('/register',validate.required('login_name'),validate.lengthAbove('login_name',4),validate.required('email'),validate.emailConfirm(),validate.passConfirm(),register.submit)
app.post('/login',login.submit)
app.post('/post',validate.required('title'),validate.lengthAbove('title',4),entry.submit)
app.post('/reply',reply.submit)
app.post('/tab',tab.submit)
app.post('/account',multer({
  dest:'./public/images/',
  rename: function(fieldname,filename){
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
  },
  limits:{ filesize: 4*1000*1000 },
  includeEmptyFields: true,
  inMemory: false,
  onFileUploadStart: function (file, req, res) {
    console.log(file.fieldname + ' is starting ...')
  },
  onFileUploadComplete: function (file, req, res) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
  },
  onError: function (error, next) {
    console.log(error)
    next(error)
  }
  }),account.update)

app.use('/list/:feature',page(Entry.getCount,'feature',25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),entry.listWithFeature)

app.use('/tab/:name/:page?',page(Entry.getCount,'tab',25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),entry.listWithTab)

app.use('/entries/:page?',page(Entry.getCount,null,25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),entry.list)

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

