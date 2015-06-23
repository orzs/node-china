var nodemailer = require('nodemailer')
var fs = require('fs')

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ljw040426@gmail.com',
    pass: '19940426likang'
  }
});

exports.sendActiveMail = function(email_to,login_name,url,fn){
  fs.readFile(__dirname + '/template/active.html','utf-8',function(err,data){
    if(err) return fn(err) 
    var content = data.replace('{{login_name}}',login_name).replace('{{active_url}}',url)
    var mailOptions = {
      from: 'ljw040426', 
      to: email_to, 
      subject: 'node-china 社区帐号激活', 
      html: content  
    }
    transporter.sendMail(mailOptions,fn)
  })
}

