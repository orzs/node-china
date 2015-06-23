var models = require('../lib/main')
var Reply = models.Reply 

exports.getRepliesByEntryId = function(entry_id,fn){
  Reply.find({entry_id:entry_id},function(err,replies){
    if(err) return fn(err)
    fn(null,replies)
  })
}

exports.getReplyByReplyId = function(reply_id,fn){
  Reply.findOne({_id:reply_id},function(err,reply){
    if(err) return fn(err)
    fn(null,reply)
  })
}

exports.createAndSave = function(res,entry_id,body,fn){
  var reply = new Reply({
    "username": res.locals.user.login_name,
    "author_id": res.locals.user._id,  
    "entry_id": entry_id,
    "body": body,
  })
  reply.save(fn)
}
