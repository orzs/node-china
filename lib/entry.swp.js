var mongoose = require('mongoose')

var entrySchema = mongoose.Schema({
  username: String,
  title: String,
  body: String,
  createDate: { type: Date, default: Date.now } 
})

var Entry = mongoose.model("Entry",entrySchema)

Entry.getRange = function(skip,perpage,fn){
  Entry.find({},{},{ skip: skip,limit:perpage,sort:"-createDate" },function(err,entries){
    if(err) return fn(err)
    fn(null,entries)
  }) 
}

Entry.getCount = function(fn){
  Entry.count({},fn)
}
