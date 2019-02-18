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

var sql = "CREATE TABLE IF NOT EXISTS User_api (username VARCHAR(255) UNIQUE, password VARCHAR(255), authentication_token VARCHAR(255) DEFAULT '')";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table User_api created");
});

var sql = "CREATE TABLE IF NOT EXISTS Product_api (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255),description VARCHAR(255), category VARCHAR(255),tags VARCHAR(255), withdrawn BOOLEAN DEFAULT false, PRIMARY KEY (id), username VARCHAR(255), FOREIGN KEY(username) REFERENCES User_api(username))";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Product_api created");
});

var sql = "CREATE TABLE IF NOT EXISTS Shop_api (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255),address VARCHAR(255), lng DOUBLE, lat DOUBLE, tags VARCHAR(255), withdrawn BOOLEAN DEFAULT false, PRIMARY KEY (id))";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Shop_api created");
});

var sql = "CREATE TABLE IF NOT EXISTS Price_api (id INT NOT NULL AUTO_INCREMENT, price DOUBLE NOT NULL, dateFrom date NOT NULL, dateTo date NOT NULL, productId INT NOT NULL, shopId INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY(productId) REFERENCES Product_api(id), FOREIGN KEY(shopId) REFERENCES Shop_api(id), CONSTRAINT Start_Finish CHECK ( dateFrom < dateTo))";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Price_api created");
});

// Create admin user
var sql = "INSERT INTO User_api (username, password, authentication_token) VALUES ('admin', 'admin', 'admin')";
conn.query(sql, function (errq) {
if (errq) throw errq;
    console.log("Admin User Created");
});


conn.end();
