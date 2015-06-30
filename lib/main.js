var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/node-china')

require('./user')
require('./entry')
require('./reply')
require('./tab')

exports.User = mongoose.model("User")
exports.Entry = mongoose.model("Entry")
exports.Reply = mongoose.model("Reply")
exports.Tab = mongoose.model("tab")
