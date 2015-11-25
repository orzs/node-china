'use strict';
var redis = require('redis');
var Notification = require('./proxy/notification');
var pub = require('./middleware/messagePublish');

module.exports = function(io){
  io.on('connection',function(socket){

    // 订阅频道
    var channel = socket.handshake.session.user._id;
    var sub = redis.createClient();
    sub.subscribe(channel);

    console.log('server connect');

    socket.on('join',function(message){
      console.log('join',message);
      Notification.calculateNoneReadMessageCount(channel,function(err,total){
        var notification = {
          'count': total
        };
        pub.publish(channel,JSON.stringify(notification)); 
      });
    });

    socket.on(channel,function(message){
      console.log('client 发送了一条消息给web server',message);
    });

    socket.on('disconnect',function(socket){
      sub.unsubscribe(channel); 
      console.log(channel,':链接中断');
    });

    sub.on('message',function(channel,message){
      console.log('channel:' + channel + '\nmessage:' + message);
      socket.emit(channel,message); 
    }); 

  });
}

