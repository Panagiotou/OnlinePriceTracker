require('dotenv').config() // require passwords and usernames etc from .env file

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

var sql = "delete from Price_api where 1;";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Price_api cleared");
});

var sql = "delete from Product_api where 1; ";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Product_api cleared");
});

var sql = "delete from Shop_api where 1; ";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Shop_api cleared");
});

var sql = "delete from User_api where 1; ";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table User_api cleared");
});

// Create db user
var sql = `INSERT INTO User_api (username, password, authentication_token, name, surname) VALUES ('${process.env.DB_USER}', '${process.env.DB_PASS}', 'admin', 'admin', 'admin')`;
conn.query(sql, function (errq) {
if (errq) throw errq;
    console.log("DB User Created");
});










conn.end();
