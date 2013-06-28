var LocalAPIKeyStrategy, LocalStrategy, User, authenticateAPIKey, ensureAdmin, ensureAuthenticated, mongoose, passport, util;

passport = require("passport");
util = require("util");
LocalStrategy = require("passport-local").Strategy;
LocalAPIKeyStrategy = require("passport-localapikey").Strategy;

mongoose = require("mongoose");
User = mongoose.model('User');

passport.serializeUser(function(user, done) {
    return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    return User.findById(id, function(err, user) {
        return done(err, user);
    });
});

passport.use(new LocalStrategy(function(username, password, done) {
    return User.findOne({ name: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, {
                message: "Invalid username or password"
            });
        }
        return user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (isMatch) { return done(null, user);
            } else {
                return done(null, false, {
                    message: "Invalid username or password"
                });
            }
        });
    });
}));


passport.use(new LocalAPIKeyStrategy(function(apikey, done) {
    return User.findOne({
        apikey: apikey
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
}));

exports.ensureAuthenticated = ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated() && req.user.enabled ) {
        return next();
    }
    return res.redirect("/logout");
};

exports.authenticateAPIKey = authenticateAPIKey = function(req, res, next) {
    passport.authenticate('localapikey', function(err, user, info) {
        if (err) {
            return res.send(403);
        }
        if (!user) {
            return res.send(403);
        }
        return req.logIn(user, function(err) {
            console.log("user:" + user.name + " login");
            if (err) {
                return next(err);
            }
            return next();
        });
    })(req, res, next);
};

exports.ensureAdmin = ensureAdmin = function(req, res, next) {
    if (req.user  && req.user.enabled && req.user.admin === true) {
        return next();
    } else {
        return res.send(403);
    }
};

exports.ensureSelfOrAdmin = function(req, res, next) {
    name = req.params.name;
    if ( req.user && req.user.enabled && (req.user.admin === true || req.user.name === name) ) {
        return next();
    } else {
        return res.send(403);
    }
};