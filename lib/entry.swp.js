var mongoose = require('mongoose')
var Schema = mongoose.Schema 

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

Entry.getRange = function(skip,perpage,fn){
  Entry.find({},{},{ skip: skip,limit:perpage,sort:"-is_top -create_date" },function(err,entries){
    if(err) return fn(err)
    fn(null,entries)
  }) 
}

Entry.getCount = function(fn){
  Entry.count({},fn)
}
