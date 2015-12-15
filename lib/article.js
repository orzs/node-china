var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
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
  tab: Strinf, // name
  last_reply: String, // id
  last_reply_user: String, // login_name
  last_reply_date: { type: Date,default: Date.now }, // time 
  reply_count: { type: Number, default: 0 },
  liked_count: { type: Number, default: 0 },
  read_count: { type: Number, default: 1 },
  deleted: { type: Boolean,default: false }
});

var Article = mongoose.model("Article",entrySchema);
