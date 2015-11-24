'use strict';
var redis = require('redis');

module.exports = function(io){
  io.on('connection',function(socket){
    var channel = socket.handshake.session.user._id;
    var sub = redis.createClient();
    sub.subscribe(channel);

    console.log('server connect');

    socket.on('join',function(message){
      console.log('join',message);
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

