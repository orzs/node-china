var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = mongoose.Schema({
    login_name: String,//require 
    name: String,//require 
    email: String,//require    
    encrypted_password: String,//require 
    create_date:{ type: Date, default: Date.now },//require 
    update_date:{ type: Date, default: Date.now },//require 
    last_sign_in_ip: String,
    current_sign_in_ip: String,
    last_sign_in_at:{ type: Date },
    currnt_sign_in_at:{ type: Date },
    accessToken: String,
    verifined:{ type: Boolean,default:  false },//require 
    email_public:{ type: Boolean,default: true },//require 
    sign_in_count: Number,
    entry_count: Number,
    reply_count: Number,
    favorite_entry_ids: [String],
    blocked_tab_ids: [String],
    blocked_user_ids: [String],
    location_city: String,
    location_id: String,
    company: String,
    summary: String,
    website: String,
    github: String,
    twitter: String,
    weibo: String,
    signature: String,
    follower_ids: [String],
    following_ids: [String],
    avatar: { type:String,default: "/images/default.jpg"},//require 
    is_blocked:{ type: Boolean,default: false },//require 
    is_star:{ type: Boolean,default: false }//require 
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
    bcrypt.hash(user.encrypted_password,salt,function(err,hash){
      if(err) return fn(err)
      user.encrypted_password = hash
      fn()
    })
  })
}

var User = mongoose.model('User',userSchema)
