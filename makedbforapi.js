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


var sql = "CREATE TABLE IF NOT EXISTS Product_api (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255),description VARCHAR(255), category VARCHAR(255),tags VARCHAR(255), withdrawn BOOLEAN DEFAULT false, PRIMARY KEY (id))";
conn.query(sql, function (errq, result) {
if (errq) throw errq;
  console.log("Table Product_api created");
});


conn.end();
