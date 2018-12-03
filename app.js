const express = require('express');

const app = express();

require('dotenv').config() // require passwords and usernames etc from .env file

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(8000, function(){
  console.log('Server started at http://localhost:8000/');
});



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

conn.end();
