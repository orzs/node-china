var models = require('../lib/main')
var bcrypt = require('bcrypt')
var User = models.User 
var Entry = models.Entry
var Eventproxy = require('eventproxy')

exports.getByMame = function(login_name,fn){
  User.findOne({login_name:login_name},function(err,user){
    if(err) return fn(err)
    user = user || {}
    fn(null,user)
  })
}

exports.authenticate = function(login_name,pass,fn){
  User.findOne({login_name:login_name},function(err,user){
    if(err) return fn(err)
    if(!user) return fn()
    if(!user._id) return fn()
    bcrypt.compare(pass,user.encrypted_password,function(err,bool){
      if(err) return fn(err)
      if(bool) return fn(null,user)
      fn()
    })
  })
}

exports.get = function(id,fn){
  User.findById(id,function(err,user){
    if(err) return fn(err)
    fn(null,user)
  })
}

exports.getCount = function(fn){
  User.count({},fn)
}

exports.createAndSave = function(data,fn){
  if(data.email_public == 1){
    data.email_public = true
  }else{
    data.email_public = false
  }
  var user = new User({
    login_name: data.login_name,
    name: data.name,
    email: data.email,
    email_public: data.email_public, 
    encrypted_password: data.pass
  })
  user.saveUser(fn)
}

exports.activeAcount = function(id,fn){
  User.update({_id:id},{$set:{verifined:true}},fn);
}

exports.updateUserInfo = function(id,data,fn){
  User.update({_id:id},{'$set':{
    'name': data.name,
    'avatar': data.avatar,
    'email_public': data.email_public,
    'location_city': data.location_city,
    'company': data.company,
    'github': data.github,
    'twitter': data.twitter,
    'weibo': data.weibo,
    'website': data.website,
    'signature': data.signature,
    'summary': data.summary
  }},function(err,data){
    if(err) return fn(err)
    fn(null,data)
  })
}

exports.getEntriesByMame = function(login_name,fn){
  var ep = Eventproxy.create("user","entries",function(user,entries){
    fn(null,user,entries)
  })
  ep.fail(fn)
  User.findOne({login_name:login_name},ep.done(function(user){
    Entry.find({author_id:user._id},{},{limit:30,sort:'-create_date'},ep.done('entries'))
    ep.emit('user',user)
  }))
}

exports.getFavoritesByMame = function(login_name,fn){
  var ep = Eventproxy.create("user","entries",function(user,entries){
    fn(null,user,entries)
  })
  ep.fail(fn)
  User.findOne({login_name:login_name},ep.done(function(user){
    var favorite_entry_ids = user.favorite_entry_ids
    var proxy = new Eventproxy()
    proxy.after('favorites_ready',favorite_entry_ids.length,function(favorites){
      ep.emit('entries',favorites)
    })
    favorite_entry_ids.forEach(function(entry_id){
      Entry.findById(entry_id,function(err,entry){
        if(err) return fn(err)
        proxy.emit('favorites_ready',entry)
      })
    })
    ep.emit('user',user)
  }))
}

exports.getFollowersByMame = function(login_name,fn){
  var ep = Eventproxy.create("user","entries",function(entries,tabs){
    fn(null,entries,tabs)
  })
  ep.fail(fn)
  User.findOne({login_name:login_name},ep.done(function(user){
    ep.emit('user',user)
  }))
}

exports.getFollowingByMame = function(login_name,fn){
  var ep = Eventproxy.create("user","entries",function(entries,tabs){
    fn(null,entries,tabs)
  })
  ep.fail(fn)
  User.findOne({login_name:login_name},ep.done(function(user){
    ep.emit('user',user)
  }))
}

exports.getBlockByMame = function(login_name,fn){
  var ep = Eventproxy.create("user","entries",function(entries,tabs){
    fn(null,entries,tabs)
  })
  ep.fail(fn)
  User.findOne({login_name:login_name},ep.done(function(user){
    ep.emit('user',user)
  }))
}

// 收藏主题
exports.collectEntryById = function(user_id,entry_id,fn){
  User.update({_id:user_id},{'$push':{"favorite_entry_ids":entry_id}},function(err,data){
    if(err) return fn(err)
    fn(null,data)
  })
}

// 取消收藏
exports.decollectEntryById = function(user_id,entry_id,fn){
  User.update({_id:user_id},{'$pull':{"favorite_entry_ids":entry_id}},function(err,data){
    if(err) return fn(err)
    fn(null,data)
  })
}

exports.enjoyEntryById = function(user_id,entry_id,fn){
  User.update({_id:user_id},{'$push':{"enjoy_entry_ids":entry_id}},function(err,data){
    if(err) return fn(err)
    fn(null,data)
  })
}

exports.cancelEnjoyEntryById = function(user_id,entry_id,fn){
  User.update({_id:user_id},{'$pull':{"enjoy_entry_ids":entry_id}},function(err,data){
    if(err) return fn(err)
    fn(null,data)
  })
}

exports.attenteEntryById = function(user_id,entry_id,fn){
  User.update({_id:user_id},{'$push':{"attention_entry_ids":entry_id}},function(err,data){
    if(err) return fn(err)
    fn(null,data)
  })
}

exports.cancenAttenteEntryById = function(user_id,entry_id,fn){
  User.update({_id:user_id},{'$pull':{"attention_entry_ids":entry_id}},function(err,data){
    if(err) return fn(err)
    fn(null,data)
  })
}
