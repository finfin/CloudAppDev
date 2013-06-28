var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var messageSchema = new Schema({
    user: String,
    text: String,
    date: {type: Date, default: Date.now},
    type: {
        type: String,
        trim: true,
        enum: [
            "public", "private"
        ]
    },
    target: String
});

module.exports = mongoose.model('Message', messageSchema);