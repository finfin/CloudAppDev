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
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) {
            res.send(400, "user or password error");
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err || !isMatch) {
                res.send(400, "user or password error");
                return;
            }

            req.session.user = user
            res.redirect('/');
            return;
        })
    });

};

exports.list = function(req, res) {
    User.find({}, function(err, users) {
        if(err) {
            logger.error(err);
            res.send(500, "error");
            return;
        }
        res.render('user/list', {
            users: users,
            user: req.session.user
        })
    });
}

exports.detail = function(req, res) {
    User.findOne({name:req.params.name}, function(err, user) {

        if(err) {
            logger.error(err);
            res.send(500);
            return;
        } else if (!user) {
            res.send(400, "cannot find users with this id");
            return;
        }
        res.send(user);
    });
}

exports.remove = function(req, res) {
    User.findOneAndRemove({name:req.params.name}, function(err, user) {
        if(err) {
            logger.error(err);
            res.send(500);
            return;
        } else if (!user) {
            res.send(400, "cannot find users with this id");
            return;
        }
        res.send("User: " + user.name + " removed");
    })
}

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
        
        res.send("successfully created user:" + user.name);
    });
}

exports.editView = function(req,res) {
    User.findOne({name: req.params.name}, function(err, edituser) {
        if(err) {
            logger.error(err);
            res.send(500);
            return;
        } else if (!edituser) {
            res.send(400, "cannot find users with this id");
            return;
        }
        res.render('user/edit', {
            editUser: edituser,
            user: req.session.user
        })
    })
}

exports.edit = function(req, res) {
    User.findOneAndUpdate({name: req.params.name}, {
        email: req.body.email,
        description: req.body.description
    }, function(err, user) {
        if(err) {
            logger.error(err);
            res.send(500);
            return;
        } else if (!user) {
            res.send(400, "cannot find users with this id");
            return;
        }
        res.redirect('/users')
    })
}