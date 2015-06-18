var models = require('../lib/main')
var User = require('./user') 
var Reply = require('./reply') 
var Eventproxy = require('eventproxy')
var Entry = models.Entry 

exports.getRange = function(skip,perpage,fn){
  Entry.find({deleted:false},{},{ skip: skip,limit:perpage,sort:"-is_top -create_date" },function(err,entries){
    if(err) return fn(err)
    fn(null,entries)
  }) 
}

exports.getCount = function(fn){
  Entry.count({},fn)
}

exports.getFullEntry = function(entry_id,fn){
  var ep = Eventproxy.create("entry","author","replies",function(entry,author,replies){
    fn(null,entry,author,replies)
  })
  ep.fail(fn)
  Entry.findOne({_id:entry_id},ep.done(function(entry){
    User.get(entry.author_id,ep.done('author'))
    Reply.getRepliesByEntryId(entry_id,ep.done('replies'))
    ep.emit('entry',entry)
  })) 
}

exports.createAndSave = function(res,title,body,tab,fn){
  var entry = new Entry({
    "username": res.locals.user.name,
    "author_id": res.locals.user._id,  
    "title": title,
    "body": body,
    "tab": tab 
  })
  entry.save(fn)
}