var mongoose = require('mongoose')
var Schema = mongoose.Schema 

var entrySchema = new Schema({
  username: String,
  author_id: Schema.ObjectId,
  title: String,
  body: String,
  html: String,
  is_top: { type: Boolean,default: false },
  is_good:{ type: Boolean,default: false },
  is_lock:{ type: Boolean,default: false },
  create_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
  tab_id: String,
  tab: String,
  last_reply: String,
  deleted: { type: Boolean,default: false }
})

var Entry = mongoose.model("Entry",entrySchema)
