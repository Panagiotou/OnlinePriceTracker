const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

//Connect to the database 'opt'
mongoose.connect('mongodb://localhost/opt');
let db = mongoose.connection;

//Check Db connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check Db errors
db.on('error', function(err){
  console.log(err);
});
// Init app
const app = express();

// Bring in Models
let User = require
//Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
// For POST requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var expressValidator = require('express-validator');
app.use(expressValidator());

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Home route
app.get('/', function(req, res){
  res.render('index', {
    title:'Prices'
  });
});


//Route files
let users = require('./routes/users');
app.use('/users', users);

//Start Server
app.listen(3000, function(){
  console.log('Server started at prot 3000...');
});
