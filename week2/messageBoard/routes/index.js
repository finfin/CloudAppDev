/*
 * GET home page.
 */
var Message = require('../models/message')


exports.index = function(req, res) {
	//TODO: 從model取得messages
	aa
	res.render('index', {
		title: 'Message Board',
		messages: null,
		user: req.session.user
	});
};


exports.createMessage = function(req, res) {
	var message = new Message(req.session.user, req.body.text);
	message.save();
	res.redirect(req.get('Referrer'));
};

exports.removeMessage = function(req, res) {
	//移除訊息，id應可以從req裡面找出
	//成功後回到來源網址
};