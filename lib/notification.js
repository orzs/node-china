var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
  from_userId: String,
  to_userId: String,
  _type: { type: Number, default: 0 },
  entry_id: String,
  Reply_id: String,
  create_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
  has_read: { type: Boolean, default: false }
});

var Notification = mongoose.model("Notification",notificationSchema);

