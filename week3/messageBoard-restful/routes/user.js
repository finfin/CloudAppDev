var mongoose = require('mongoose');

var User = mongoose.model('User');
/*
 * GET users listing.
 */

exports.loginView = function(req, res) {
	res.render('login', {
		title: 'Message Board'
	});
};

exports.registerView = function(req, res) {
	res.render('register', {
		title: '註冊使用者'
	});
};

exports.login = function(req, res) {
	User.findOne({name: req.body.name}, function(err, user) {
		if(err) {
			res.send(400, "user or password error");
		}
		user.comparePassword(req.body.password, function(err, isMatch){
			if(err || !isMatch) {
				res.send(400, "user or password error");
				return;
			}

			req.session.user = user
			res.redirect('/');
			return;
		})
	});
	
};

exports.logout = function(req, res) {
	delete req.session.user;
	res.redirect('/');
}

exports.register = function(req, res) {
	User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		description: req.body.description
	}, function(err, user) {
		if (err) {
			console.log(err);
			res.send(400, "Invalid data format");
			return;
		}
		console.dir("Created user:", user);
		res.send("successfully created user:" + user.name);
	});


}