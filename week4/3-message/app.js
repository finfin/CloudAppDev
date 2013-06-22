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
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(log4js.connectLogger(logger, { level: 'auto' }));
app.use(express.cookieParser()); 
app.use(express.session({secret: 'messageboardsecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use('/api', auth.authenticateAPIKey)
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/users', user.list);
app.get('/users/:name', user.detail);
app.get('/users/:name/edit', user.editView);
app.put('/users/:name', user.edit);
app["delete"]('/users/:name', user.remove);

app.get('/', message.index);
app.get('/messages', message.index);
app.post('/messages', auth.ensureAuthenticated, message.createMessage);
app.get('/mymessage', auth.ensureAuthenticated, message.myMessage);
app["delete"]('/messages/:id', auth.ensureAuthenticated, message.removeMessage);

//REST API Routes
app.post('/apiLogin', user.apiLogin);
app.get('/apiLogout', user.apiLogout);
app.get('/api/messages', message.index);

app.listen(app.get('port'), function() {
  console.log("HTTP Server listening to port: " + app.get('port'));
});