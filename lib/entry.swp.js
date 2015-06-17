require('./user.swp')
require('./reply')
var mongoose = require('mongoose')
var Schema = mongoose.Schema 
var Eventproxy = require('eventproxy')

var entrySchema = new Schema({
  username: String,
  author_id: Schema.ObjectId,
  title: String,
  body: String,
  is_top: { type: Boolean,default: false },
  is_good:{ type: Boolean,default: false },
  is_lock:{ type: Boolean,default: false },
  create_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
  tab: String,
  deleted: { type: Boolean,default: false }
})

var Entry = mongoose.model("Entry",entrySchema)
var User = mongoose.model('User')
var Reply = mongoose.model('Reply')

Entry.getRange = function(skip,perpage,fn){
  Entry.find({deleted:false},{},{ skip: skip,limit:perpage,sort:"-is_top -create_date" },function(err,entries){
    if(err) return fn(err)
    fn(null,entries)
  }) 
}

Entry.getCount = function(fn){
  Entry.count({},fn)
}

Entry.getFullEntry = function(entry_id,fn){
  var ep = Eventproxy.create("entry","author","replies",function(entry,author,replies){
    fn(null,entry,author,replies)
  })
  ep.fail(fn)
  Entry.findOne({_id:entry_id},ep.done(function(entry){
    User.get(entry.author_id,ep.done('author'))
    Reply.getRepliesByEntryId(entry_id,ep.done('replies'))
    ep.emit('entry',entry)
  })) 
}
