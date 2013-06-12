
/*
 * GET users listing.
 */

exports.loginView = function(req, res) {
	res.render('login', {
		title: 'Message Board'
	});
};

exports.login = function(req, res){
	req.session.user = req.body.name;
    res.redirect('/');
};

exports.logout = function(req, res){
	delete req.session.user;
	res.redirect('/');
}