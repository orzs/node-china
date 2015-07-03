var models = require('../lib/main')
var User = require('./user') 
var Reply = require('./reply') 
var Eventproxy = require('eventproxy')
var Entry = models.Entry 
var Tab = require('./tab')
var Marked = require('marked');

exports.getRange = function(skip,perpage,fn){
  var ep = Eventproxy.create("entries","tabs",function(entries,tabs){
    fn(null,entries,tabs)
  })
  ep.fail(fn)
  Entry.find({deleted:false},{},{ skip:skip,limit:perpage,sort:"-is_top -create_date" },ep.done('entries'))
  Tab.getHotTabs(ep.done('tabs'))
}

exports.getTabRange = function(tab,skip,perpage,fn){
  var ep = Eventproxy.create("entries","tab",function(entries,tab){
    fn(null,entries,tab)
  }) 
  ep.fail(fn)
  var filter = { deleted: false, tab:tab }
  var option = { skip:skip, limit:perpage, sort:"-is_top -create_date" }
  Entry.find(filter,{},option,ep.done('entries'))
  Tab.getByMame(tab,ep.done('tab'))
}

exports.getFeatureRange = function(feature,skip,perpage,fn){
  var filter = { deleted: false }
  var option = { skip:skip, limit:perpage, sort:"-is_top -create_date" }
  if(feature == 'good'){
    filter = { deleted:false,is_good:true }
  }else if(feature == 'no_reply'){
    filter = { deleted:false,reply_count:0 }
  }else if(feature == 'last'){
    option = { skip:skip, limit:perpage, sort:"-create_date" }
  }

  Entry.find(filter,{},option,function(err,entries){
    if(err) return fn(err)
    fn(null,entries)
  })
}

exports.getCount = function(options,fn){
  Entry.count(options,fn)
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

exports.createAndSave = function(res,title,body,tab_id,fn){
  var entry = new Entry({
    "username": res.locals.user.login_name,
    "author_id": res.locals.user._id,  
    "title": title,
    "body": body,
    "html": Marked(body),
    "tab_id": tab_id  
  })
  entry.save(fn)
}
