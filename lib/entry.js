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
  tab: String, // name
  last_reply: String, // id
  last_reply_user: String, // login_name
  reply_count: { type: Number, default: 0 },
  liked_count: { type: Number, default: 0 },
  deleted: { type: Boolean,default: false }
})

var Entry = mongoose.model("Entry",entrySchema)
