var proxy = require("../proxy/main")
var User = proxy.User 
var Entry = proxy.Entry

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

//  关注别人
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

//  关注自己
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

//  屏蔽别人
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
  var entry_id = req.params['id']
  User.collectEntryById(req.user._id,entry_id,function(err,data){
    if(data.ok == 1){
      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
        res.json({data:'ok',status:0,message:'收藏成功'})
      })
    }else{
      res.json({status:1})
    }
  })
}

exports.decollectEntry = function(req,res,next){
  var entry_id = req.params['id']
  User.decollectEntryById(req.user._id,entry_id,function(err,data){
    if(data.ok == 1){
      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
      res.json({data:'ok',status:0,message:'取消收藏成功'})
      })
    }else{
      res.json({status:1})
    }
  })
}

exports.enjoyEntry = function(req,res,next){
  var entry_id = req.params['id'];
  User.enjoyEntryById(req.user._id,entry_id,function(err,data){
    if(data.ok == 1){
      Entry.updateLikedCount(entry_id,"like",function(err,entry){
        if(err){} //TODO  
        //TODO 
      });

      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
        res.json({data:'ok',status:0,message:'喜欢成功'})
      })
    }else{
      res.json({status:1})
    }
  })
}

exports.cancelEnjoyEntry = function(req,res,next){
  var entry_id = req.params['id'];
  User.cancelEnjoyEntryById(req.user._id,entry_id,function(err,data){
    if(data.ok == 1){
      Entry.updateLikedCount(entry_id,"de_like",function(err,entry){
        if(err){} //TODO  
        //TODO 
      });

      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
        res.json({data:'ok',status:0,message:'取消喜欢成功'})
      })
    }else{
      res.json({status:1})
    }
  })
}

exports.attenteEntry = function(req,res,next){
  var entry_id = req.params['id'];
  User.attenteEntryById(req.user._id,entry_id,function(err,data){
    if(data.ok == 1){
      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
        res.json({data:'ok',status:0,message:'关注成功'})
      })
    }else{
      res.json({status:1})
    }
  })
}

exports.cancelAttenteEntry = function(req,res,next){
  var entry_id = req.params['id'];
  User.cancelAttenteEntryById(req.user._id,entry_id,function(err,data){
    if(data.ok == 1){
      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
        res.json({data:'ok',status:0,message:'取消关注成功'})
      })
    }else{
      res.json({status:1})
    }
  })
}

exports.enjoyReply = function(req,res,next){
  var reply_id = req.params['id'];
  User.enjoyReplyById(req.user._id,reply_id,function(err,data){
    if(data.ok == 1){
      Reply.updateLikedCount(reply_id,"like",function(err,entry){
        if(err){} //TODO  
        //TODO 
      });

      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
        res.json({data:'ok',status:0,message:'喜欢成功'})
      })
    }else{
      res.json({status:1,message:'喜欢失败'})
    }
  })
}

exports.cancelEnjoyReply = function(req,res,next){
  var reply_id = req.params['id'];
  User.cancelEnjoyReplyById(req.user._id,reply_id,function(err,data){
    if(data.ok == 1){
      Reply.updateLikedCount(reply_id,"de_like",function(err,entry){
        if(err){} //TODO  
        //TODO 
      });

      User.get(req.user._id,function(err,user){
        if(err) return next(err)
        req.session.user = user 
        res.json({data:'ok',status:0,message:'取消喜欢成功'})
      })
    }else{
      res.json({status:1,message:'取消喜欢势失败'})
    }
  })
}

