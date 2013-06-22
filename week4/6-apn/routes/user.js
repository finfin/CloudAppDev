var mongoose = require('mongoose');
var passport = require('passport');
var Mailer = require('../util/emailer');
var User = mongoose.model('User');
/*
 * GET users listing.
 */
var log4js = require('log4js');
var logger = log4js.getLogger();

exports.loginView = function(req, res) {
    res.render('login', {
        title: 'Message Board',
        message: req.session.messages
    });
};

exports.registerView = function(req, res) {
    res.render('register', {
        title: '註冊使用者'
    });
};

exports.login = function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages = [info.message];
            return res.redirect("/login");
        }
        return req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            //TODO: update UUID
        });
    })(req, res, next);
};

exports.apiLogin = function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send(403);
        }
        res.cookie('apikey', user.apikey, {
            maxAge: 86409000,
            httpOnly: true
        });

        user.UUID = req.body.UUID;
        user.save(function(err) {
            if(err) {
                logger.error(err);
            }
            res.end();
        });


    })(req, res, next);
};

exports.apiLogout = function(req, res, next) {
    res.clearCookie('apikey');
    return res.end();
};

exports.list = function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            logger.error(err);
            res.send(500, "error");
            return;
        }
        res.render('user/list', {
            users: users,
            user: req.user
        })
    });
}

exports.detail = function(req, res) {
    User.findOne({
        name: req.params.name
    }, function(err, user) {

        if (err) {
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
    User.findOneAndRemove({
        name: req.params.name
    }, function(err, user) {
        if (err) {
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
    req.logout();
    res.redirect('/');
}

exports.register = function(req, res) {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        description: req.body.description,
        admin: Boolean(req.body.admin)
    }, function(err, user) {
        if (err) {
            logger.error(err);
            res.send(400, "Invalid data format or duplicate user name");
            return;
        }
        console.log("Created user:", user.name);
        res.send("successfully created user:" + user.name);

        var options = {
            to: user.email
        };

        var data = {
            name: user.name,
            token: user.token,
            host: req.headers.host
        };
        
        var mailer = new Mailer(options, data);
        mailer.send(function(err, result) {
            if(err) {
                return logger.error(err);
            }
        });
    });
}

exports.editView = function(req, res) {
    User.findOne({
        name: req.params.name
    }, function(err, edituser) {
        if (err) {
            logger.error(err);
            res.send(500);
            return;
        } else if (!edituser) {
            res.send(400, "cannot find users with this id");
            return;
        }
        res.render('user/edit', {
            editUser: edituser,
            user: req.user
        })
    })
}

exports.edit = function(req, res) {
    User.findOneAndUpdate({
        name: req.params.name
    }, {
        email: req.body.email,
        description: req.body.description
    }, function(err, user) {
        if (err) {
            logger.error(err);
            res.send(500);
            return;
        } else if (!user) {
            res.send(400, "cannot find users with this id");
            return;
        }
        res.redirect('/users');
    })
}

exports.validate = function(req, res) {
    var token = req.query.token;
    return User.findOneAndUpdate({
      token: token
    }, {
      enabled: true,
      token: null
    }, function(err, user) {
      if (err) {
        return res.send(500);
      }
      if (!user) {
        return res.send(403);
      }
      req.session.messages = ["User: " + user.name + " validated, please login."];
      return res.redirect('/login')
    });
};