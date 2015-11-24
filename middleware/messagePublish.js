'use strict';
var redis = require('redis');
var pub = redis.createClient();

var self = module.exports = {
    publish: function(channel,message){
      pub.publish(channel,message);            
    }
};
