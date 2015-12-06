var proxy = require('../proxy/main');
var search = proxy.search;

exports.searchAll = function(req,res,next){
  var searchText = req.query['searchKey']; 
  search.searchAll(searchText,function(err,total,entries){
    if(err) return next(err);
    console.log('entries',entries);
    res.render('search_results',{
      title: '搜索',
      total: total,
      searchKey: searchText,
      entries: entries 
    });
  });
}

