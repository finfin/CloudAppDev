/*
 * GET home page.
 */
var Message = require('../models/message')


exports.index = function(req, res) {
	//TODO: 從model取得messages
	
	res.render('index', {
		title: 'Message Board',
		messages: Message.messages,
		user: req.session.user
	});
};

exports.myMessage = function(req, res) {
	//TODO: 從model取得message, 並以req.session.user篩選使用者

	res.render('index', {
		title: 'My Message Board',
		messages: Message.myMessage(req.session.user),
		user: req.session.user
	});
};

exports.createMessage = function(req, res) {
	var message = new Message(req.session.user, req.body.text);
	message.save();
	res.redirect(req.get('Referrer'));
};

exports.removeMessage = function(req, res) {
	Message.remove(req.params.id);
	res.redirect(req.get('Referrer'));
};