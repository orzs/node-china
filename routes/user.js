var proxy = require("../proxy/main")
var User = proxy.User 

exports.form = function(req,res,next){
  if(!res.locals.user) return next()
  User.get(res.locals.user._id,function(err,user){
    if(err) return next(err)
    res.render('user/edit',{
      title:'account',
      user: user
    }) 
  })
}

exports.update = function(req,res,next){
  var data = req.body
  data.email_public = true
  if(req.files.avatar){
    var length = req.files.avatar.path.length
    data.avatar = req.files.avatar.path.substring(6,length)
  }else{
    data.avatar = res.locals.user.avatar
  }
  User.updateUserInfo(res.locals.user._id,data,function(err,data){
    if(err) return next(err)
    if(data.ok == 1){
      // 更新session res user 信息
      User.get(res.locals.user._id,function(err,user){
        if(err) console.log(err)
        req.session.user = user 
        res.locals.user = user
      })
      res.redirect('user/edit')
    }else{
      res.end('faile')
    }
  })
}

exports.show = function(req,res,next){
  var login_name = req.params['login_name']
  User.getByMame(login_name,function(err,user){
    if(err) return next(err)
    res.render('user/index',{
      title: 'account',
      user: user
    })
  })
}
