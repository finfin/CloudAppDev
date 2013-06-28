/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var log4js = require('log4js');
var passport = require('passport');


log4js.configure('config/log4js.json');
var logger = log4js.getLogger();

var uristring = "mongodb://localhost/messageBoard";
var mongoOptions = {
  db: {
    safe: true
  }
};

mongoose.connect(uristring, mongoOptions, function(err, res) {
  if (err) {
    return console.error("ERROR connecting to: " + uristring + ". " + err);
  } else {
    return console.log("Successfully connected to: " + uristring);
  }
});

require('./models/user');
require('./models/message');

var message = require('./routes/message');
var user = require('./routes/user');
var auth = require('./util/auth');

// Express Configuration
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(log4js.connectLogger(logger, { level: 'auto' }));
app.use(express.cookieParser()); 
app.use(express.session({secret: 'messageboardsecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  if(req.user)
    req.userId = req.user.name;
  next();
});
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use('/api', auth.authenticateAPIKey);
app.use(app.router);
app.use(express.static(path.join(__dirname, '/../public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// WEB Routes
app.get('/login', user.loginView);
app.post('/login', user.login);
app.get('/logout', user.logout);
app.get('/register', user.registerView);
app.post('/register', user.register);
app.get('/validate', user.validate);
app.get('/users', auth.ensureAdmin, user.list);
app.get('/users/:name', auth.ensureSelfOrAdmin, user.detail);
app.get('/users/:name/edit', auth.ensureSelfOrAdmin, user.editView);
app.put('/users/:name', auth.ensureSelfOrAdmin, user.edit);
app["delete"]('/users/:name', auth.ensureAdmin, user.remove);

app.get('/', message.index);
app.get('/messages', message.index);
app.post('/messages', auth.ensureAuthenticated, message.createMessage);
app.get('/mymessage', auth.ensureAuthenticated, message.myMessage);
app["delete"]('/messages/:id', auth.ensureAuthenticated, message.removeMessage);

//REST API Routes
app.post('/apiLogin', user.apiLogin);
app.get('/apiLogout', user.apiLogout);
app.get('/api/messages', message.list);
app.post('/api/messages', message.createMessage);
app.get('/api/mymessages', message.myMessage);
app["delete"]('/api/messages/:id', message.removeMessage);
app.get('/api/users/:name', auth.ensureSelfOrAdmin, user.detail);

app.listen(app.get('port'), function() {
  console.log("HTTP Server listening to port: " + app.get('port'));
});