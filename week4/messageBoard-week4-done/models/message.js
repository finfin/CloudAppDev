var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

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

var Message = mongoose.model('Message', messageSchema);