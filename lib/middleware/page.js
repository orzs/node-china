module.exports = function(fn,perpage){
  perpage = perpage || 10
  return function(req,res,next){
    var page = Math.max(1,parseInt(req.params['page'] || '1',10)) -1 
    fn(function(err,total){
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
