var proxy = require("../proxy/main");
var Notification = proxy.Notification;

exports.list = function(req,res,next){
  Notification.getNoReadNotification(req.user._id,0,20,function(err,notifications){
    if(err) return next(err);
    res.render('notifications',{
      title: '未读消息',
      notifications: notifications   
    }); 
  }); 
}

exports.clear = function(req,res,next){
  Notification.clearNoReadNotification(req.user._id,function(err,notifications){
    if(err) return next(err);
    res.redirect('/notifications');
  });
}
