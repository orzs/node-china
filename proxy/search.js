var Eventproxy = require('eventproxy');
var User = require('./user');
var searchClient = require('../middleware/elasticSearchClient');

exports.searchAll = function(searchText,skip,perpage,fn){
  searchClient.search({
    index: 'node_china',
    from: skip,
    size: perpage,
    body: {
      query: {
        multi_match: {
          query: searchText,        
          fields: ['title','body','tab']
        }
      }
    }
  }, function (error, response) {
    if(error) return fn(error);

    var hits = response.hits;
    var entries = new Array();
    hits.hits.forEach(function(hit){
      entries.push(hit._source); 
    });

    var proxy = new Eventproxy();
    proxy.after('entris_ready',entries.length,function(detail_entries){
      fn(null,hits.total,detail_entries);
    });
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
      });
    });
  });
}

exports.getCount = function(searchText,fn){
  searchClient.count({
    index: 'node_china',
    body: {
      query: {
        multi_match: {
          query: searchText,        
          fields: ['title','body','tab']
        }
      }
    }
  }, function (error, response) {
    if(error) return fn(error);
    fn(null,response.count);
  });
}

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
