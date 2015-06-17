var models = require("../lib/main")
var Entry = models.Entry  

exports.list = function(req,res,next){
  var page = req.page 
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
    "author_id": res.locals.user._id,  
    "title": data.title,
    "body": data.body,
    "tab": data.tab 
  })
  entry.save(function(err){
    if(err) return next(err)
    res.redirect('/')
  })
}

exports.full = function(req,res,next){
  var entry_id = req.params['id']
  Entry.getFullEntry(entry_id,function(err,entry,author,replies){
    console.log('*******',entry)
    console.log('*******',author)
    console.log('*******',replies)
    if(err) return next(err)
    res.render('entry',{
      entry:entry,
      author:author,
      replies:replies
    })
  })
}
