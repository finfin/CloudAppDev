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
    //TODO
}));


passport.use(new LocalAPIKeyStrategy(function(apikey, done) {
    //TODO
}));

exports.ensureAuthenticated = ensureAuthenticated = function(req, res, next) {
    //TODO
};

exports.authenticateAPIKey = authenticateAPIKey = function(req, res, next) {
    //TODO
};