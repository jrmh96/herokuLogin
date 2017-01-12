var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var mongoURI = process.env.MONGODB_URI;

// mongodb connection
mongoose.connect(mongoURI);
var db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
    secret: 'treehouse loves you',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// make user ID available in templates
// (allows navbar to change based on logged in/ logged out status)
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

// Initialize app
 var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname+'/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});
