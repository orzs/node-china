var proxy = require('../proxy/main');
var Reply = proxy.Reply;

exports.submit = function(req,res,next){
  var data = req.body
  Reply.createAndSave(res,data.entry_id,data.body,function(err,reply,entry){
    if(err) return next(err);
    res.redirect('/entry/' + data.entry_id + "#reply1");
  });
}

exports.edit = function(req,res,next){
  var body = req.body;
  var reply_id = req.params['reply_id'];
  Reply.updateBody(reply_id,body,function(err,data){
    if(data.ok == 1){
      res.json({data:'ok',status:0,message:'更新成功'}); 
    }else{
      res.json({data:'fail', status:1,message:'更新失败'}); 
    }
  });
}
