var redis = require('redis')
var bcrypt = require('bcrypt')
var db = redis.createClient()

module.exports = User

function User(obj){
  for(var key in obj){
    this[key] = obj[key]
  }
}

User.prototype.save = function(fn){
  if(this.id){
    this.update(fn)
  }else{
    var user = this;
    db.incr('user:ids',function(err,id){
      if(err) return fn(err)
      user.id = id;
      user.hashPassword(function(err){
        if(err) return fn(err)
        user.update(fn)
      })
    })
  }
}

User.prototype.update = function(fn){
  var user = this;
  var id = user.id
  db.set('user:id:' + user.name, id, function(err){
    if(err) return fn(err)
    db.hmset('user:' + id, user, function(err){
      fn(err)
    })
  })
}

User.prototype.hashPassword = function(fn){
  var user = this
  bcrypt.genSalt(12,function(err,salt){
    if(err) return fn(err)
    user.salt = salt
    bcrypt.hash(user.pass , salt , function(err,hash){
      if(err) return fn(err)
      user.pass = hash
      fn()
    })
  })
}

// 通过 name  取 User
User.getByMame = function(name,fn){
  User.getId(name,function(err,id){
    if(err) return fn(err)
    User.get(id,fn)
  })
}

// 通过 name 取 id
User.getId = function(name,fn){
  db.get('user:id:' + name, fn)
}

// 通过 id  取 user
User.get = function(id,fn){
  db.hgetall('user:' + id, function(err,user){
    if(err) return fn(err)
    fn(null,new User(user))
  })
}

User.authenticate = function(name,pass,fn){
  User.getByMame(name,function(err,user){
    if(err) return fn(err)
    if(!user.id) return fn()
    bcrypt.hash(pass,user.salt,function(err,hash){
      if(err) return fn(err)
      if(hash == user.pass) return fn(null,user)
      fn()
    })
  })
}

