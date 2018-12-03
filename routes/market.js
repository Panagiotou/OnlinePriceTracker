const express = require('express');
const router = express.Router();
//connect to Database
require('dotenv').config() // require passwords and usernames etc from .env file

var mysql      = require('mysql');
var con = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});


connection.connect(function(err) {
  if (err) throw err;
  console.log('Database connection established !');
});

// Add Market Form
router.get('/addMarket', function(req, res){
  res.render('addMarket');
});

// Add Market Proccess
router.post('/addMarket', function(req, res){
  const name = req.body.name;
  const street = req.body.street;
  const number = req.body.number;
  const postal = req.body.postal;
  const city = req.body.city;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('street', 'Steet is required').notEmpty();
  req.checkBody('number', 'Number is required').notEmpty();
  req.checkBody('postal', 'Postal is required').notEmpty();
  req.checkBody('city', 'City is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('addMarket', {
      errors:errors
    });
  } else {
          conn.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
          var sql = "INSERT INTO Market (name,street,number,postal,city ) VALUES (?,?,?,?,?)";
          var value = [name,street,number,postal,city];

          conn.query(sql, values, function (err) {
            if (err) throw err;
            console.log("New Market added" );
          });
        });
});

module.exports = router;
