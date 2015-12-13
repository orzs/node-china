var proxy = require("../proxy/main");
var Notification = proxy.Notification;

exports.list = function(req,res,next){
  var page = req.page;
  Notification.getNoReadNotification(req.user._id,page.skip,page.perpage,function(err,notifications){
    if(err) return next(err);
    res.render('notification/notifications',{
      title: '未读消息',
      notifications: notifications   
    }); 
  }); 
}

exports.clear = function(req,res,next){
  Notification.clearNoReadNotification(req.user._id,function(err,notifications){
    if(err) return next(err);
    res.redirect('notification/notifications');
  });
}

exports.read = function(req,res,next){
  var notification_id = req.params['id'];
  Notification.readNotification(notification_id,function(err,notification){
    if(err) return next(err); 
    res.redirect('notification/notifications');
  });

}
