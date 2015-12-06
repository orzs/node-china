var Eventproxy = require('eventproxy');
var User = require('./user');
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

    var hits = response.hits;
    var entries = new Array();
    hits.hits.forEach(function(hit){
      entries.push(hit._source); 
    });

    var proxy = new Eventproxy();
    proxy.after('entris_ready',entries.length,function(detail_entries){
      fn(null,hits.total,detail_entries);
    });
    entries.forEach(function(entry,index){
      User.get(entry.author_id,function(err,user){
        if(err) fn(err)
        entry.author = user
        proxy.emit('entris_ready',entry)
      });
    });
  });
}

