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



var sql = "CREATE TABLE IF NOT EXISTS User (username VARCHAR(255) PRIMARY KEY, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, surname VARCHAR(255) NOT NULL)";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table User created");
});

var sql = "CREATE TABLE IF NOT EXISTS Market (name VARCHAR(255) NOT NULL, street VARCHAR(255) NOT NULL, number INT NOT NULL, postal INT NOT NULL, city VARCHAR(255) NOT NULL, PRIMARY KEY(street, number, postal, city))";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Market created");
});

var sql = "CREATE TABLE IF NOT EXISTS Product (name VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, price FLOAT NOT NULL, category VARCHAR(255) NOT NULL, username VARCHAR(255), PRIMARY KEY(name, brand, username), FOREIGN KEY(username) REFERENCES User(username), street VARCHAR(255) NOT NULL, number INT NOT NULL, postal INT NOT NULL, city VARCHAR(255) NOT NULL, FOREIGN KEY(street, number, postal, city) REFERENCES Market(street, number, postal, city))";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Product created");
});


conn.end();
