var models = require('../lib/main')
var Reply = models.Reply
var Eventproxy = require('eventproxy')
var Entry = require('./entry')
var User = require('./user')
var Marked = require('marked');

exports.getRepliesByEntryId = function(entry_id, fn) {
  Reply.find({entry_id: entry_id}, function(err, replies) {
    if (err) return fn(err)
    var ep = new Eventproxy()
    ep.after('replies_redy',replies.length,function(replies){
      fn(null,replies)
    })
    replies.forEach(function(reply){
      User.get(reply.author_id,function(err,user){
        if(err) return fn(err)
        reply.author = user
        ep.emit('replies_redy',reply)
      })
    })
  })
}

exports.getReplyByReplyId = function(reply_id, fn) {
  Reply.findOne({_id: reply_id}, function(err, reply) {
    if (err) return fn(err)
    fn(null, reply)
  })
}

exports.getCount = function(fn) {
  Reply.count({}, fn)
}

exports.createAndSave = function(res, entry_id, body, fn) {
  var reply = new Reply({
    "username": res.locals.user.login_name,
    "author_id": res.locals.user._id,
    "entry_id": entry_id,
    "html": Marked(body),
    "body": body
  })
  var ep = Eventproxy.create("saveReply", "updateEntry", function(reply, entry) {
    fn(null, reply, entry)
  })
  ep.fail(fn)
  reply.save(ep.done(function(reply) {
    Entry.updateReplyInfo(entry_id, reply._id, res.locals.user.login_name, ep.done('updateEntry'))
    ep.emit('saveReply', reply)
  }))
}

exports.updateLikedCount = function(id,action,fn){
  if(action == "like"){
    Reply.update({'_id':id},{'$inc':{'liked_count':1}},function(err,entry){
      if(err) return fn(err)
      fn(null,entry)
    })
  }else if(action == "de_like"){
    Reply.update({'_id':id},{'$inc':{'liked_count':-1}},function(err,entry){
      if(err) return fn(err)
      fn(null,entry)
    })
  }
};
