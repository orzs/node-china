var proxy = require('../proxy/main');
var search = proxy.search;

exports.searchAll = function(req,res,next){
  var searchText = req.query['searchKey']; 
  search.searchAll(searchText,function(err,response){
    console.log("response:",response);
    res.render('search_results',{
      response:JSON.stringify(response) 
    });
  });
}

exports.searchEntry = function(req,res,next){
  var searchText = req.query['searchKey']; 
  search.searchEntry(searchText,function(err,response){
    console.log("response:",response);
    res.render('search_results',{
      response:JSON.stringify(response) 
    });
  });
}
