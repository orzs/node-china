var proxy = require("../proxy/main")
var Tab = proxy.Tab

exports.getTabsJson = function(req,res,next){
  var schema = req.query.term 
  Tab.getTabsBySchema(schema,function(err,tabs){
    if(err) return next(err)
    res.json(JSON.stringify(tabs))
  }) 
}

exports.submit = function(req,res,next){
  var data = req.body
  console.log(data)
  Tab.createAndSave(data.name,data.description,function(err,tab){
    if(err) return next(err)
    res.json({status: 0})
  })
}
exports.form = function(req,res){
  res.render('new_tab_form',{
    title: 'Post'
  })
}

