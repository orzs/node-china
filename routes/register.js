var proxy = require("../proxy/main");
var mail = require("../common/mail/mail");
var utility = require('utility');
var User = proxy.User;
var searchClient = require('../middleware/elasticSearchClient');

exports.form = function(req,res){
  res.render('login/register',{title: 'Register'});
}

exports.submit = function(req,res,next){
  var data = req.body; 
  User.getByMame(data.login_name, function(err,user){
    if(err) return next(err);
    if(user._id){
      res.error("Username already exist");
      res.redirect('back');
    }else{
      User.createAndSave(data,function(err,user){
        if(err) return next(err);
        
        // 简历索引,用于查询
        searchClient.index({
          index: 'node_china',
          type: 'user',
          body: user 
        }, function (error, response) {
          if(error) console.log(error); 
          console.log(response); 
        });

        var url = "http://127.0.0.1:4000/active_acount?key=" + utility.md5(user.email + user.encrypted_password) + "&name=" + user.login_name;
        mail.sendActiveMail(user.email,user.login_name,url,function(err){
          if(err) console.log(err);
        })
        res.error("激活邮件已经发送，请前往邮箱激活 ");
        res.redirect('back');
      });
    }
  })
}
