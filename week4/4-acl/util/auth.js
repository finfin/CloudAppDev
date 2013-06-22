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
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/logout");
};

exports.authenticateAPIKey = authenticateAPIKey = function(req, res, next) {
    util.log('autheticating api');
    passport.authenticate('localapikey', function(err, user, info) {
        if (err) {
            return res.send(403);
        }
        if (!user) {
            return res.send(403);
        }
        return req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
        });
    })(req, res, next);
    return next();
};

exports.ensureAdmin = ensureAdmin = function(req, res, next) {
    //TODO
};

exports.ensureSelfOrAdmin = function(req, res, next) {
    //TODO
};