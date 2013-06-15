var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

var messageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    date: {type: Date, default: Date.now}
});

messageSchema.statics.findMessageByName = function(name, cb) {
    var that = this;
    User.findOne({
        name: name
    }, function(err, user) {
        return that.find({
            user: user._id
        }).populate('user', 'name').exec(cb);
    })
}

var Message = mongoose.model('Message', messageSchema);

console.log("message")