var express = require('express');
var router = express.Router();
var multer = require('multer');

// router  
var register = require('./register');
var login = require('./login');
var reply = require('./reply');
var entry = require('./entry');
var tab = require('./tab');
var account = require('./user');
var search = require('./search');
var notification = require('./notification');

// proxy
var proxy = require("../proxy/main");
var User = proxy.User;
var Reply = proxy.Reply;
var Entry = proxy.Entry;  

// 中间件
var validate = require('../middleware/validate');
var statistics = require('../middleware/statistics');
var page = require('../middleware/page');

// api get 
router.get('/entry/:id',entry.full);
router.get('/register',register.form);
router.get('/login',login.form);
router.get('/logout',login.logout);
router.get('/post',entry.form);
router.get('/active_acount',login.activeAcount);
router.get('/tabs',tab.getTabsJson);
router.get('/user/edit',account.form);
router.get('/notifications/clear',notification.clear);

router.get('/user/:login_name/entries',account.showWithEntries);
router.get('/user/:login_name/favorites',account.showWithFavorites);
router.get('/user/:login_name/followers',account.showWithFollowers);
router.get('/user/:login_name/following',account.showWithFollowing);
router.get('/user/:login_name/blocked',account.showWithBlocked);
router.get('/user/:login_name',account.show);
router.get('/reply/:id',reply.jsonReply);

// api post
router.post('/entry/:id/collect',account.collectEntry);
router.post('/entry/:id/de_collect',account.decollectEntry);
router.post('/entry/:id/like',account.enjoyEntry);
router.post('/entry/:id/de_like',account.cancelEnjoyEntry);
router.post('/entry/:id/follow',account.attenteEntry);
router.post('/entry/:id/de_follow',account.cancelAttenteEntry);
router.post('/reply/:id/like',account.enjoyReply);
router.post('/reply/:id/de_like',account.cancelEnjoyReply);
router.post('/reply/:id',reply.edit);

router.post('/register',validate.required('login_name'),validate.lengthAbove('login_name',4),validate.required('email'),validate.emailConfirm(),validate.passConfirm(),register.submit);
router.post('/login',login.submit);
router.post('/post',validate.required('title'),validate.lengthAbove('title',4),entry.submit);
router.post('/reply',reply.submit);
router.post('/tab',tab.submit);
router.post('/account',multer({
  dest:'./public/images/',
  rename: function(fieldname,filename){
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
  },
  limits:{ filesize: 4*1000*1000 },
  includeEmptyFields: true,
  inMemory: false,
  onFileUploadStart: function (file, req, res) {
    console.log(file.fieldname + ' is starting ...');
  },
  onFileUploadComplete: function (file, req, res) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  },
  onError: function (error, next) {
    console.log(error)
    next(error)
  }
  }),account.update);

// api 列表
router.use('/list/:feature/:page?',page(Entry.getCount,'feature',25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),entry.listWithFeature);

router.use('/tab/:name/:page?',page(Entry.getCount,'tab',25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),entry.listWithTab);

router.use('/entries/:page?',page(Entry.getCount,null,25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),entry.list);

router.use('/search/all/:page?',page(Entry.getCount,null,25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),search.searchAll);

router.use('/notifications/:page?',page(Entry.getCount,null,25),statistics(User.getCount,'user'),statistics(Entry.getCount,'entry'),statistics(Reply.getCount,'reply'),notification.list);

module.exports = router;

