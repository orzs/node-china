var mongoose = require('mongoose')
var Schema = mongoose.Schema 

var replySchema = new Schema({
  username: String,
  author_id: Schema.ObjectId,
  entry_id: Schema.ObjectId,
  body: String,
  html: String,
  liked_count: { type: Number, default: 0 },
  create_date:{ type: Date ,default: Date.now },
  update_date:{ type: Date ,default: Date.now },
  deleted: { type:Boolean,default: false },
})

var Reply = mongoose.model("Reply",replySchema)

