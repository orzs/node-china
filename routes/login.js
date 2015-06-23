var proxy = require("../proxy/main")
var mail = require("../common/mail/mail")
var utility = require('utility')
var User = proxy.User   

exports.form = function(req,res){
  res.render('login',{title: 'Login'})
}

exports.submit = function(req,res,next){
  var data = req.body
  User.authenticate(data.login_name,data.pass,function(err,user){
    if(err) return next(err)
    if(user){
      if(!user.verifined){
        var url = "http://127.0.0.1:4000/active_acount?key=" + utility.md5(user.email + user.encrypted_password) + "&name=" + user.login_name
        mail.sendActiveMail(user.email,user.login_name,url,function(err){
          if(err) console.log(err)
        })
        res.error('该账户未被激活，激活邮件已发送到' + user.email + ',请到邮箱内激活')
        res.redirect('back')
      }else{
        req.session.uid = user._id
        res.redirect('/entries')
      }
    }else{
      res.error('Sorry! invalid credentials.')
      res.redirect('back')
    }
  })
}

exports.logout = function(req,res){
  req.session.destroy(function(err){
    if(err) throw err
    res.redirect('/entries')
  })
}

exports.activeAcount = function(req,res,next){
  var data = req.query
  User.getByMame(data.name,function(err,user){
    if(utility.md5(user.email + user.encrypted_password) == data.key){
      User.activeAcount(user._id,function(err,user){
        res.redirect('/login')
      }) 
    }else{
      res.end('激活链接失效')
    }
  })  
}
