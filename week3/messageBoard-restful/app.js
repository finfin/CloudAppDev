/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser()); 
app.use(express.session({secret: 'messageboardsecret'}));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var uristring = "mongodb://localhost/messageBoard";
var mongoOptions = {
  db: {
    safe: true
  }
};

mongoose.connect(uristring, mongoOptions, function(err, res) {
  if (err) {
    return console.log("ERROR connecting to: " + uristring + ". " + err);
  } else {
    return console.log("Successfully connected to: " + uristring);
  }
});

require('./models/user');
require('./models/message');

var message = require('./routes/message');
var user = require('./routes/user');

// Routes
// TODO: 1. 把路徑換成restful的樣式
//       2. 新增user的CRUD路徑
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
app.get('/message', message.index);
app.post('/message', message.createMessage);
app.get('/mymessage', message.myMessage);
app["delete"]('/messages/:id', message.removeMessage);

app.listen(app.get('port'), function() {
  console.log("HTTP Server listening to port: " + app.get('port'));
});