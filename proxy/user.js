var models = require('../lib/main')
var bcrypt = require('bcrypt')
var User = models.User 

exports.getByMame = function(login_name,fn){
  User.findOne({login_name:login_name},function(err,user){
    if(err) return fn(err)
    user = user || {};
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

