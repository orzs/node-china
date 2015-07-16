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

exports.showWithEntries = function(req,res,next){
  var login_name = req.params['login_name']
  User.getEntriesByMame(login_name,function(err,user,entries){
    if(err) return next(err)
    res.render('user/entry',{
      title: 'account',
      user: user,
      entries: entries
    })
  })
}

exports.showWithFavorites = function(req,res,next){
  var login_name = req.params['login_name']
  User.getFavoritesByMame(login_name,function(err,user,entries){
    if(err) return next(err)
    res.render('user/favorite',{
      title: 'account',
      user: user,
      entries: entries 
    })
  })
}

exports.showWithFollowers = function(req,res,next){
  var login_name = req.params['login_name']
  User.getFollowersByMame(login_name,function(err,user,users){
    if(err) return next(err)
    res.render('user/index',{
      title: 'account',
      user: user,
      users: users
    })
  })
}

exports.showWithFollowing = function(req,res,next){
  var login_name = req.params['login_name']
  User.getFollowingByMame(login_name,function(err,user,users){
    if(err) return next(err)
    res.render('user/index',{
      title: 'account',
      user: user,
      users: users
    })
  })
}

exports.showWithBlocked = function(req,res,next){
  var login_name = req.params['login_name']
  User.getBlockedByMame(login_name,function(err,user,users){
    if(err) return next(err)
    res.render('user/index',{
      title: 'account',
      user: user,
      users: users
    })
  })
}

exports.collectEntry = function(req,res,next){
  console.log("user is",res.locals.user)
  var data = req.body
  var user_id = res.locals.user._id
  User.collectEntryById(user_id,data.id,function(err,data){
    if(data.ok == 1){
      res.json({data:'ok',status:0,message:'收藏成功'})
    }else{
      res.json({status:1})}
  })
}

exports.decollectEntry = function(req,res,next){
  var data = req.body 
  var user_id = res.locals.user._id
  User.decollectEntryById(user_id,data.id,function(err,data){
    if(data.ok == 1){
      res.json({data:'ok',status:0,message:'取消搜藏成功'})
    }else{
      res.json({status:1})
    }
  })
}
