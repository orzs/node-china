exports.wiki = function(req,res,next){
  res.render('base/wiki',{
    title: 'Wiki' 
  });
}

exports.api = function(req,res,next){
  res.render('base/api',{
    title: 'API' 
  });
}
