var proxy = require("../proxy/main");
var Notification = proxy.Notification;

exports.list = function(req,res,next){
  Notification.getNoReadNotification(req.user._id,0,20,function(err,notifications){
    if(err) return next(err);
    res.render('notifications',{
      notifications: JSON.stringify(notifications)  
    }); 
  }); 
}

