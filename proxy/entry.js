var models = require('../lib/main');
var User = require('./user');
var Reply = require('./reply'); 
var Eventproxy = require('eventproxy');
var Entry = models.Entry;
var Tab = require('./tab');
var Marked = require('marked');

exports.getRange = function(skip,perpage,fn){
  var ep = Eventproxy.create("entries","tabs",function(entries,tabs){
    fn(null,entries,tabs)
  })
  ep.fail(fn)
  Entry.find({deleted:false},{},{ skip:skip,limit:perpage,sort:"-is_top -create_date" },ep.done(function(entries){
    var proxy = new Eventproxy()
    proxy.after('entris_ready',entries.length,function(detail_entries){
      ep.emit('entries',detail_entries) 
    })
    entries.forEach(function(entry,index){
      if(entry.last_reply_user){
        entry.timeTrap = calculateTimeInterval(entry.last_reply_date); 
      }else{
        entry.timeTrap = calculateTimeInterval(entry.create_date);; 
      }
      User.get(entry.author_id,function(err,user){
        if(err) return fn(err)
        entry.author = user  
        proxy.emit('entris_ready',entry)
      })
    })
  }))
  Tab.getHotTabs(ep.done('tabs'))
}

exports.getTabRange = function(tab,skip,perpage,fn){
  var ep = Eventproxy.create("entries","tab",function(entries,tab){
    fn(null,entries,tab)
  }) 
  ep.fail(fn)
  var filter = { deleted: false, tab:tab }
  var option = { skip:skip, limit:perpage, sort:"-is_top -create_date" }
  Entry.find(filter,{},option,ep.done(function(entries){
    var proxy = new Eventproxy()
    proxy.after('entris_ready',entries.length,function(detail_entries){
      ep.emit('entries',detail_entries)
    })
    entries.forEach(function(entry,index){
      if(entry.last_reply_user){
        entry.timeTrap = calculateTimeInterval(entry.last_reply_date); 
      }else{
        entry.timeTrap = calculateTimeInterval(entry.create_date);; 
      }
      User.get(entry.author_id,function(err,user){
        if(err) fn(err)
        entry.author = user
        proxy.emit('entris_ready',entry)
      })
    })
  }))
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
    var ep = new Eventproxy()
    ep.after('entris_ready',entries.length,function(detail_entries){
      fn(null,detail_entries)
    })
    entries.forEach(function(entry,index){
      if(entry.last_reply_user){
        entry.timeTrap = calculateTimeInterval(entry.last_reply_date); 
      }else{
        entry.timeTrap = calculateTimeInterval(entry.create_date);; 
      }
      User.get(entry.author_id,function(err,user){
        if(err) fn(err)
        entry.author = user
        ep.emit('entris_ready',entry)
      })
    })
  })
}

exports.getCount = function(options,fn){
  Entry.count(options,fn)
}

exports.updateReplyInfo = function(id,last_reply,last_reply_date,login_name,fn){
  Entry.update({'_id':id},{'$inc':{'reply_count':1},'$set':{'last_reply':last_reply,'last_reply_date':last_reply_date,'last_reply_user':login_name}},function(err,data){
    if(err) return fn(err);
    fn(null,data);
  });
}

exports.getFullEntry = function(entry_id,fn){
  var ep = Eventproxy.create("entry","author","replies",function(entry,author,replies){
    fn(null,entry,author,replies);
  });
  ep.fail(fn);
  Entry.findOne({_id:entry_id},ep.done(function(entry){
    entry.create_timeTrap = calculateTimeInterval(entry.create_date);
    entry.last_reply_timeTrap = calculateTimeInterval(entry.last_reply_date);
    User.get(entry.author_id,ep.done('author'));
    Reply.getRepliesByEntryId(entry_id,ep.done('replies'));
    ep.emit('entry',entry);

    Entry.update({_id:entry_id},{'$inc':{'read_count':1}},function(err,data){
      if(err) console.log(err);  
    });
  }));
}

exports.getEntryById = function(entry_id,fn){
  Entry.findOne({_id:entry_id},function(err,entry){
    if(err) return fn(err);
    fn(null,entry);
  });
}

exports.createAndSave = function(res,title,body,tab_id,tab_name,fn){
  var entry = new Entry({
    "username": res.locals.user.login_name,
    "author_id": res.locals.user._id,  
    "title": title,
    "body": body,
    "html": Marked(body),
    "tab_id": tab_id,
    "tab": tab_name  
  })
  var ep = Eventproxy.create("saveEntry","updateTab",function(entry,tab){
    fn(null,entry)
  })
  ep.fail(fn)
  entry.save(ep.done('saveEntry'))
  Tab.addEntryCount(tab_id,ep.done('updateTab'))
}

exports.updateLikedCount = function(id,action,fn){
  if(action == "like"){
    Entry.update({'_id':id},{'$inc':{'liked_count':1}},function(err,entry){
      if(err) return fn(err)
      fn(null,entry)
    })
  }else if(action == "de_like"){
    Entry.update({'_id':id},{'$inc':{'liked_count':-1}},function(err,entry){
      if(err) return fn(err)
      fn(null,entry)
    })
  }
};


/*
 * util 函数
 */ 
function calculateTimeInterval(old_time){
  
  now_time = new Date();
  var timeInterVal = Math.abs(Date.parse(now_time)/1000 - Date.parse(old_time)/1000);
  var timeTrap;
  console.log('timeInterVal:',timeInterVal);
  if(timeInterVal<60){
    timeTrap = "1分钟内"; 
  }else if(timeInterVal>=60 && timeInterVal<(60*60)){
    timeTrap = Math.round(timeInterVal/60) + " 分钟前"; 
  }else if(timeInterVal>=(60*60) && timeInterVal<(60*60*24)){
    timeTrap = Math.round(timeInterVal/(60*60)) + "小时前"; 
  }else if(timeInterVal>=(60*60*24) && timeInterVal<(60*60*24*30)){
    timeTrap = Math.round(timeInterVal/(60*60*24)) + "天前";
  }else if(timeInterVal>=(60*60*24*30) && timeInterVal<(60*60*24*30*12)){
    timeTrap = Math.round(timeInterVal/(60*60*24*30)) + "个月前";
  }else{
    timeTrap = Math.round(timeInterVal/(60*60*24*30*12)) + "年前";
  }
  return timeTrap;
}
