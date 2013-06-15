var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

// message欄位：
// user: 連結至user model
// text: 字串
// date: 日期，預設值為now
var messageSchema = new Schema({
    
});

var Message = mongoose.model('Message', messageSchema);