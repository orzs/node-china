var models = require('../lib/main')
var bcrypt = require('bcrypt')
var User = models.User 

exports.getByMame = function(name,fn){
  User.findOne({name:name},function(err,user){
    if(err) return fn(err)
    user = user || {};
    fn(null,user)
  })
}

exports.authenticate = function(name,pass,fn){
  User.findOne({name:name},function(err,user){
    if(err) return fn(err)
    if(!user._id) return fn()
    bcrypt.hash(pass,user.salt,function(err,hash){
      if(err) return fn(err)
      if(hash==user.pass) return fn(null,user)
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

exports.createAndSave = function(name,pass,fn){
  var user = new User({
    name: name,
    pass: pass
  })
  user.saveUser(fn)
}
