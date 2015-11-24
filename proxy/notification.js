var models = require('../lib/main');
var pub = require('../middleware/messagePublish');
var Notification = models.Notification;
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
  pub.publish(to_userId,message);
};

exports.NotificationType = NotificationType;

