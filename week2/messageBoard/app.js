/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes/index');
var user = require('./routes/user');
var path = require('path');
var Message = require('./models/message')

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
console.log(app.get('env'))

// Routes
app.get('/', routes.index);
app.get('/login', user.loginView);
app.post('/login', user.login);

app.listen(app.get('port'), function() {
  console.log("HTTP Server listening to port: " + app.get('port'));
});