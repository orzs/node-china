var proxy = require('../proxy/main')
var Reply = proxy.Reply 

exports.submit = function(req,res,next){
  var data = req.body
  Reply.createAndSave(res,data.entry_id,data.body,function(err,reply,entry){
    if(err) return next(err)
    res.redirect('/entry/' + data.entry_id + "#reply1")
  })
}
