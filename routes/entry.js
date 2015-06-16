var models = require("../lib/main")
var Entry = models.Entry  

exports.list = function(req,res,next){
  var page = req.page 
  console.log("page",page)
  Entry.getRange(page.skip,page.perpage,function(err,entries){
    if(err) return next(err)
    res.render('entries',{
      title: 'Entries',
      entries: entries
    })
  })
}

exports.form = function(req,res){
  res.render('post',{
    title: 'Post'
  })
}

exports.submit = function(req,res,next){
  var data = req.body
  
  var entry = new Entry({
    "username": res.locals.user.name,
    "title": data.title,
    "body": data.body
  })
  
  entry.save(function(err){
    if(err) return next(err)
    res.redirect('/')
  })
}
