var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

// mongodb connection
mongoose.connect("mongodb://localhost:27017/bookworm");
var db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// serve static files from /public
app.use(express.static(dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname+'/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

