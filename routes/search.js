var proxy = require('../proxy/main');
var Search = proxy.Search;

exports.searchAll = function(req,res,next){
  var page = req.page;
  var searchText = req.query['searchKey']; 
  Search.searchAll(searchText,page.skip,page.perpage,function(err,total,entries){
    if(err) return next(err);
    res.render('search/search_results',{
      title: '搜索',
      total: total,
      searchKey: searchText,
      entries: entries 
    });
  });
}

