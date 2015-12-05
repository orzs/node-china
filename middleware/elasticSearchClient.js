var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'trace'
});

client.ping({
  requestTimeout: 30000,
  hello: "elasticsearch"
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('search all is well');
  }
});

module.exports = client;

