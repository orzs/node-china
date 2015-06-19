var proxy = require("../proxy/main")
var Entry = proxy.Entry 

exports.list = function(req,res,next){
  var page = req.page 
  Entry.getRange(page.skip,page.perpage,function(err,entries){
    if(err) return next(err)
    res.render('index',{
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
  Entry.createAndSave(res,data.title,data.body,data.tab,function(err){
    if(err) return next(err)
    res.redirect('/')
  })
}

exports.full = function(req,res,next){
  var entry_id = req.params['id']
  Entry.getFullEntry(entry_id,function(err,entry,author,replies){
    if(err) return next(err)
    res.render('entry',{
      title:'Entry',
      entry:entry,
      author:author,
      replies:replies
    })
  })
}
