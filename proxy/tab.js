var models = require('../lib/main')
var Tab = models.Tab   

exports.getCount = function(fn){
  Tab.count({},fn)
}

exports.createAndSave = function(name,description,fn){
  var tab = new Tab({
    name: name,
    description: description,
  })
  tab.save(fn)
}

exports.addFollowerCount = function(id){
  Tab.update({'_id':id},{'$inc':{'follower_count':1}});
}

exports.addEntryCount = function(id){
  Tab.update({'_id':id},{'$inc':{'entry_count':1}});
}

// 用于 select2 首字母匹配 
exports.getTabsBySchema = function(schema,fn){
  var query = new RegExp(schema)
  Tab.find({name:query},function(err,tabs){
    if(err) return fn(err)
    fn(null,tabs)
  }) 
}

exports.getHotTabs = function(fn){
  Tab.find({},{},{limit:50,sort:"follower_count"},function(err,tabs){
    if(err) return fn(err)
    fn(null,tabs)
  })
}

exports.getByMame = function(name,fn){
  Tab.findOne({name:name},function(err,tab){
    if(err) return fn(err)
    fn(null,tab)
  })
}
