
function initSocketIo(channel){
  var host = window.location.host; 
  socket = io.connect('http://' + host,{
    reconnect:false,
    'try multiple transports': false 
  })

  socket.on('connect', function(msg) {
    console.log('client connected');
    socket.emit('join', 'one user join');
  });

  socket.on(channel, function(msg) {
    console.log('收到消息',msg);
    var notification = JSON.parse(msg); 
    if(notification.count == 0){
      $('.count').text(); 
      $('#notification').attr('class','zero');
    }else{
      $('#notification .count').text(notification.count); 
      $('#notification').attr('class','new');
    }
  });
}

