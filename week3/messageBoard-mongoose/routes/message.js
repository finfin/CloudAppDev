/*
 * GET home page.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Message = mongoose.model('Message');


exports.index = function(req, res) {
    //TODO: 從model取得messages
    Message.find().populate('user', 'name').exec(function(err, messages) {
        res.render('index', {
            title: 'Message Board',
            messages: messages || [],
            user: req.session.user
        });
    });
};

exports.myMessage = function(req, res) {
    //TODO: 從model取得message, 並以req.session.user篩選使用者
    Message.findMessageByName(req.session.user.name, function(err, messages){
        res.render('index', {
            title: 'My Message Board',
            messages: messages || [],
            user: req.session.user
        });
    });
    
};

exports.createMessage = function(req, res) {
    Message.create({
        user: req.session.user._id,
        text: req.body.text
    }, function(err, message) {
        if (err) {
            console.log(err);
            res.send(500, "Message creation error");
            return;
        }
        res.redirect(req.get('Referrer'));
    })

};

exports.removeMessage = function(req, res) {
    Message.remove({_id: req.params.id}, function(err) {
        if (err) {
            console.log(err);
            res.send(500, "Message operation error");
            return;
        }
        res.redirect(req.get('Referrer'));
    });
    
};