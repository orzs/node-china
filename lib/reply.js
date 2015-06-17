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

Reply.getRepliesByEntryId = function(entry_id,fn){
  Reply.find({entry_id:entry_id},function(err,replies){
    if(err) return fn(err)
    fn(null,replies)
  })
}

Reply.getReplyByReplyId = function(reply_id,fn){
  Reply.findOne({_id:reply_id},function(err,reply){
    if(err) return fn(err)
    fn(null,reply)
  })
}
