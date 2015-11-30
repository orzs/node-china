var proxy = require("../proxy/main")
var Entry = proxy.Entry 

exports.list = function(req,res,next){
  var page = req.page 
  Entry.getRange(page.skip,page.perpage,function(err,entries,tabs){
    if(err) return next(err)
    res.render('index',{
      title: '首页',
      entries: entries,
      tabs: tabs 
    })
  })
}

exports.listWithTab = function(req,res,next){
  var tab = req.params['name']
  var page = req.page 
  
  Entry.getTabRange(tab,page.skip,page.perpage,function(err,entries,tab){
    if(err) return next(err)
    res.render('tab_entries',{
      title: tab.name,
      tab: tab,
      entries: entries
    }) 
  })
}

exports.listWithFeature = function(req,res,next){
  var feature = req.params['feature']
  var page = req.page

  Entry.getFeatureRange(feature,page.skip,page.perpage,function(err,entries){
    if(err) return next(err)
    res.render('feature_entries',{
      title: feature,
      entries: entries 
    })
  })
}

exports.form = function(req,res){
  res.render('post',{
    title: 'Post'
  })
}

exports.submit = function(req,res,next){
  var data = req.body
  Entry.createAndSave(res,data.title,data.body,data.tab_id,data.tab_name,function(err){
    if(err) return next(err)
    res.redirect('/entries')
  })
}

exports.full = function(req,res,next){
  var entry_id = req.params['id']
  Entry.getFullEntry(entry_id,function(err,entry,author,replies){
    if(err) return next(err)
    var user = req.user;
    entry = packEntryWithLoginUser(entry,user);
    replies = packRepliesWithLoginUser(replies,user);
    res.render('entry',{
      title:'Entry',
      entry:entry,
      author:author,
      replies:replies
    })
  })
}

/*
 * 绑定和当前登陆用户的关系
 */
function packEntryWithLoginUser(entry,user){
  if(user){
    entry.isFavorite = in_Array(user.favorite_entry_ids,entry._id);
    entry.isAttention = in_Array(user.attention_entry_ids,entry._id);
    entry.isLike = in_Array(user.enjoy_entry_ids,entry._id);
  }
  return entry;
} 

function packRepliesWithLoginUser(replies,user){
  if(user){
    for(var id in replies){
      var reply = replies[id];
      console.log('reply',reply);
      var in_array = in_Array(user.enjoy_reply_ids,reply._id); 
      console.log(reply._id,":"+in_array);
      reply.isLike = in_array;
    } 
  }
  return replies;
}

function in_Array(array,key){
  for(var id in array){
    if(array[id] == key){
      return true;
    }
  }
  return false;
}

