var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/node-china')

require('./user.swp')
require('./entry.swp')
require('./reply')

exports.User = mongoose.model("User")
exports.Entry = mongoose.model("Entry")
exports.Reply = mongoose.model("Reply")