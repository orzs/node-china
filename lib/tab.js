var mongoose = require('mongoose')
var Schema = mongoose.Schema 

var tabSchema = new Schema({
  name: String,
  description: String,
  follower_count: { type:Number, default: 1 },     
  create_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
})

var Tab = mongoose.model("tab",tabSchema)
