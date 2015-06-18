var mongoose = require('mongoose')
var Schema = mongoose.Schema 

var replySchema = new Schema({
  username: String,
  author_id: Schema.ObjectId,
  entry_id: Schema.ObjectId,
  body: String,
  create_date:{ type: Boolean,default: false },
  update_date:{ type: Boolean,default: false },
  deleted: { type:Boolean,default: false },
})

var Reply = mongoose.model("Reply",replySchema)
