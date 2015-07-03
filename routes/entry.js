var proxy = require("../proxy/main")
var Entry = proxy.Entry 

exports.list = function(req,res,next){
  var page = req.page 
  Entry.getRange(page.skip,page.perpage,function(err,entries,tabs){
    if(err) return next(err)
    res.render('index',{
      title: '首页',
      entries: entries,
      tabs: tabs 
    })
  })
}

exports.listWithTab = function(req,res,next){
  var tab = req.params['name']
  var page = req.page 
  Entry.getTabRange(tab,page.skip,page.perpage,function(err,entries,tab){
    if(err) return next(err)
    res.render('tab_entries',{
      title: tab.name,
      tab: tab,
      entries: entries
    }) 
  })
}

exports.listWithFeature = function(req,res,next){
  var feature = req.params['feature']
  var page = req.page
  Entry.getFeatureRange(feature,page.skip,page.perpage,function(err,entries){
    if(err) return next(err)
    res.render('feature_entries',{
      title: feature,
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
  console.log(data)
  Entry.createAndSave(res,data.title,data.body,data.tab_id,function(err){
    if(err) return next(err)
    res.redirect('/entries')
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
