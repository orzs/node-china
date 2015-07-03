module.exports = function(fn,flag,perpage){
  perpage = perpage || 10
  return function(req,res,next){
    var page = Math.max(1,parseInt(req.params['page'] || '1',10)) -1 
    var option = {}
    if(flag == 'tab'){
      option = { deleted:false,tab:req.params['name'] }
    }else if(flag == 'feature'){
      var feature = req.params['feature']
      if(feature == 'good'){
        option = { deleted:false,is_good:true }
      }else if(feature == 'no_reply'){
        option = { deleted:false,reply_count:0 }
      }else if(feature == 'last'){
        // 数量一致
      }
    }
    fn(option,function(err,total){
      if(err) return next(err)
      req.page = res.locals.page ={
        number: page,
        perpage: perpage,
        skip: page * perpage,
        total: total,
        count: Math.ceil(total/perpage)
      }
      next()
    })
  }
}
