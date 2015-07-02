var mongoose = require('mongoose')
var Schema = mongoose.Schema 

var tabSchema = new Schema({
  name: String,
  description: String,
  follower_count: { type:Number, default: 0 },     
  entry_count: { type:Number, default: 0 },     
  create_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
})

var Tab = mongoose.model("tab",tabSchema)
