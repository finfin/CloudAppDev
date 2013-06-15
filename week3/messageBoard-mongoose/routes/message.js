/*
 * GET home page.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');


exports.index = function(req, res) {
    // TODO: 資料庫找出messages
    // 記得讓user.name有值
    // Hint: Message.find()
    res.render('index', {
        title: 'Message Board',
        messages: messages || [],
        user: req.session.user
    });
};

exports.myMessage = function(req, res) {
    // TODO: 找出collection中user=req.session.user._id的留言
    // Hint: Message.find(), populate
    res.render('index', {
        title: 'My Message Board',
        messages: mymessages || [],
        user: req.session.user
    });
};

exports.createMessage = function(req, res) {
    // 新增一筆Message, 
    // user=@req.session.user._id
    // text=@req.body.text
    // 成功的話導向req.get('Referrer')
    // 新增方式可參照routes/user.register
    var message = new Message(req.session.user, req.body.text);
    message.save();
    res.redirect(req.get('Referrer'));

};

exports.removeMessage = function(req, res) {
    // 移除message._id=@req.params.id
    // 成功的話導向req.get('Referrer')
    Message.remove(req.params.id);
    res.redirect(req.get('Referrer'));
};