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
