module.exports = function(fn,field){
  return function(req,res,next){
    fn(function(err,total){
      if(err) return next(err)
      if(!res.locals.statistics){
        res.locals.statistics = {}
      }
      res.locals.statistics[field] = total 
      next()
    })
  }
}

