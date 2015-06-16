var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = mongoose.Schema({
    name: String,
    pass: String, 
    salt: String 
})

userSchema.methods.saveUser = function(fn){
  var user = this
  user.hashPassword(function(err){
    if(err) return fn(err)
    user.save(function(err,user){
      if(err) return fn(err)
      fn(null,user)
    })
  })
}

userSchema.methods.hashPassword = function(fn){
  var user = this
  bcrypt.genSalt(12,function(err,salt){
    if(err) return fn(err)
    user.salt = salt
    bcrypt.hash(user.pass,salt,function(err,hash){
      if(err) return fn(err)
      user.pass = hash
      fn()
    })
  })
}

var User = mongoose.model('User',userSchema)

User.getByMame = function(name,fn){
  User.findOne({name:name},function(err,user){
    if(err) return fn(err)
    user = user || {};
    fn(null,user)
  })
}

User.authenticate = function(name,pass,fn){
  User.getByMame(name,function(err,user){
    if(err) return fn(err)
    if(!user._id) return fn()
    bcrypt.hash(pass,user.salt,function(err,hash){
      if(err) return fn(err)
      if(hash==user.pass) return fn(null,user)
      fn()
    })
  })
}

User.get = function(id,fn){
  User.findById(id,function(err,user){
    if(err) return fn(err)
    fn(null,user)
  })
}

