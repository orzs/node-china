var models = require('../lib/main');
var Notification = models.Notification;
var proxy = require('../proxy/main');
var User = proxy.User;
var Entry = proxy.Entry;
var Eventproxy = require('eventproxy');
var pub = require('../middleware/messagePublish');

var NotificationType;
if(typeof NotificationType == "undefined"){
  NotificationType = {};
  NotificationType.NONE = 0;
　NotificationType.COLLECT_ENTRY = 1;
　NotificationType.UNCOLLECT_ENTRY = 2;
  NotificationType.FOLLOW_ENTRY = 3;
  NotificationType.UNFOLLOW_ENTRY = 4;
  NotificationType.ENjOY_ENTRY = 5;
  NotificationType.UNENjOY_ENTRY = 6;
  NotificationType.REPLY_ENTRY = 7;
  NotificationType.AT_USER = 8;
　NotificationType.REPLY_REPLY = 9;
　NotificationType.EDIT_ENTRY = 10;
　NotificationType.CLOSE_ENTRY = 11;
　NotificationType.STAR_ENTRY = 12;
　NotificationType.STAR_USER = 13;
}
exports.NotificationType = NotificationType;

exports.createNotification = function(data,fn){
  var notification = new Notification({
    "from_userId": data.from_userId,
    "to_userId": data.to_userId,
    "_type": data.type,
    "entry_id": data.entry_id,
    "reply_id": data.reply_id
  });

  notification.save(fn);
};

exports.calculateNoneReadMessageCount = function(to_userId,fn){
  Notification.count({'to_userId':to_userId,'has_read':false},fn); 
};

exports.getNoReadNotification = function(userId,skip,perpage,fn){
  Notification.find({ has_read:false,to_userId:userId },{},{ skip:skip,limit:perpage,sort:"-create_date" },function(err,notifications){
    var proxy = new Eventproxy(); 
    proxy.after('notifications_ready',notifications.length,function(detail_notifications){
      fn(null,detail_notifications);
    });
    notifications.forEach(function(notification,index){
      var ep = Eventproxy.create("user","entry",function(user,entry){
        notification.user = user;
        notification.entry = entry;
        proxy.emit('notifications_ready',notification); 
      });
      ep.fail(fn);

      User.get(notification.from_userId,ep.done('user')); 
      Entry.getEntryById(notification.entry_id,ep.done(function(entry){
        if(entry){
          if(entry.last_reply){
            entry.timeTrap = calculateTimeInterval(entry.last_reply_date);
          }else{
            entry.timeTrap = calculateTimeInterval(entry.create_date);
          }
        }
        ep.emit('entry',entry);
      }));
    });
  }); 
}

exports.clearNoReadNotification = function(userId,fn){
  Notification.find({ has_read:false,to_userId:userId },{},{},function(err,notifications){
    var proxy = new Eventproxy();
    proxy.after('notifications_update',notifications.length,function(notifications){
      fn(null,notifications);    
    });
    proxy.fail(fn);
    notifications.forEach(function(notification,index){
      Notification.update({ _id:notification._id },{'$set':{'has_read':true}},function(err,notification){
        if(err) return fn(err);
        proxy.emit('notifications_update',notification);
      });
    });
  });
}

exports.getCount = function(userId,fn){
  Notification.count({has_read:false,to_userId:userId},fn);
}

exports.sendNotification = function(notification,fn){
  var from_userId = notification.from_userId; 
  var to_userId = notification.to_userId;
  var type = notification._type;
  var entry_id = notification.entry_id;
  var reply_id = notification.reply_id;

  var message = "用户:" + from_userId;

  var messageType;
  switch(type){
    case NotificationType.NONE:
      messageType = "未知消息";
      break;
  　case NotificationType.COLLECT_ENTRY:
      messageType = "收藏了话题";
      break;
  　case NotificationType.UNCOLLECT_ENTRY:
      messageType = "取消收藏了话题";
      break;
    case NotificationType.FOLLOW_ENTRY:
      messageType = "关注了话题";
      break;
    case NotificationType.UNFOLLOW_ENTRY:
      messageType = "取消关注话题";
      break;
    case NotificationType.ENjOY_ENTRY:
      messageType = "喜欢了话题";
      break;
    case NotificationType.UNENjOY_ENTRY:
      messageType = "取消喜欢了话题";
      break;
    case NotificationType.REPLY_ENTRY:
      messageType = "回答了话题";
      break;
    case NotificationType.AT_USER:
      messageType = "@了你";
      break;
  　case NotificationType.REPLY_REPLY:
      messageType = "评论了你的评论";
      break;
  　case NotificationType.EDIT_ENTRY:
      messageType = "修改了话题";
      break;
  　case NotificationType.CLOSE_ENTRY:
      messageType = "关闭了话题";
      break;
  　case NotificationType.STAR_ENTRY:
      messageType = "置顶了话题";
      break;
    case NotificationType.STAR_USER:
      messageType = "star 了你";
      break;
    default:
      break;
  }

  message += messageType + ":" + entry_id;
  Notification.count({'to_userId':to_userId,'has_read':false},function(err,total){
    var notification = {
      'count': total,
      'message': message 
    };  
    pub.publish(to_userId,JSON.stringify(notification));
  }); 
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
