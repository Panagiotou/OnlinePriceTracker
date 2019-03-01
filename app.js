const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config() // require passwords and usernames etc from .env file

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));


// Connection to database

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});


conn.connect(function(err) {
  if (err) throw err;
  console.log('Database connection established !');
});

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));



// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Route Files
let user = require('./routes/user');
app.use('/', user);
let product = require('./routes/product');
app.use('/products',product);
//Route API files
var login_route = require('./api/routes/login');
login_route(app);
var logout_route = require('./api/routes/logout');
logout_route(app);
var product_routes = require('./api/routes/products');
product_routes(app);
var shop_routes = require('./api/routes/shops');
shop_routes(app);
var price_routes = require('./api/routes/prices');
price_routes(app);


app.listen(8765, function(){
  console.log('Server started at http://localhost:8765/');
});

//Home route
app.get('/', async (req, res) =>{
  var sql = "SELECT * FROM Product_api";
  await new Promise((resolve, reject) => {
    conn.query(sql, function (err, result){
      if(err){
        throw err;
      }
      else{
        productList = result;
        resolve()
      }
    });
  });
  res.render('home', {Product: productList});
});
