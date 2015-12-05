var searchClient = require('../middleware/elasticSearchClient');

exports.searchAll = function(searchText,fn){
  searchClient.search({
    index: 'node_china',
    body: {
      query: {
        multi_match: {
          query: searchText,        
          fields: ['title','body','tab']
        }
      }
    }
  }, function (error, response) {
    if(error) return fn(error);
    fn(null,response.hits);
  });
}

exports.searchEntry = function(searchText,fn){
  searchClient.search({
    index: 'node_china',
    type: 'entry',
    body: {
      query: {
        multi_match: {
          query: searchText,        
          fields: ['title','body','tab']
        }
      }
    }
  }, function (error, response) {
    if(error) return fn(error);
    fn(null,response.hits);
  });
}

