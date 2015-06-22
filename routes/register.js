var proxy = require("../proxy/main")
var User = proxy.User   

exports.form = function(req,res){
  res.render('register',{title: 'Register'})
}

exports.submit = function(req,res,next){
  var data = req.body 
  User.getByMame(data.login_name, function(err,user){
    if(err) return next(err)
    if(user._id){
      res.error("Username already exist")
      res.redirect('back')
    }else{
      User.createAndSave(data.login_name,data.pass,function(err,user){
        if(err) return next(err)
        req.session.uid = user._id
        res.redirect('/entries')
      })
    }
  })
}
