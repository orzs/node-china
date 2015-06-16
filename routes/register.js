var models = require("../lib/main")
var User = models.User   

exports.form = function(req,res){
  res.render('register',{title: 'Register'})
}

exports.submit = function(req,res,next){
  var data = req.body 
  User.getByMame(data.name, function(err,user){
    if(err) return next(err)
    if(user._id){
      res.error("Username already exist")
      res.redirect('back')
    }else{
      user = new User({
        name: data.name,
        pass: data.pass
      })
      user.saveUser(function(err,user){
        if(err) return next(err)
        req.session.uid = user._id
        res.redirect('/')
      })
    }
  })
}
