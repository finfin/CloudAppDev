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
	// 導至register view
	// title設定為 "註冊使用者"
};

exports.login = function(req, res) {

	// 1. User.findOne 找出name=@req.body.name的一筆資料
	// 2. 利用user.comparePassword比對@req.body.password是否等於此筆資料的password
	// 3. 相等則重新導向至'/'，並將req.session.user設定為找到的user
	// 4. 不相等回傳400, "user or password error"
	User.findOne(/* TODO: queries */, function(err, user) {
		if(err) {
			res.send(400, "user or password error");
		}
		user.comparePassword(
			//TODO: step 3 and 4
		)
	});
	
};

exports.logout = function(req, res) {
	delete req.session.user;
	res.redirect('/');
}

exports.register = function(req, res) {
	//使用者欄位： name=@req.body.name, email=@req.body.email, password=@req.body.password, description=@req.body.description
	User.create(/* TODO: setup user fields */, function(err, user) {
		if (err) {
			console.log(err);
			res.send(400, "Invalid data format");
			return;
		}
		console.dir("Created user:", user);
		res.send("successfully created user:" + user.name);
	});


}