const express = require('express');
const router = express.Router();
const passport = require('passport');

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
});

// Register Form
router.get('/', function(req, res){
  res.sendFile('/views/register.html', { root: '.' });
});

// Register Proccess
router.post('/', function(req, res){
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  let errors = req.validationErrors();
  console.log( errors )
  if(errors){
    res.sendFile('/views/register.html', { root: '.', errors: errors});
  }
  else{
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    let errors1 = req.validationErrors();
    console.log( errors )
    if(errors1){
      res.sendFile('/views/register.html', { root: '.', errors: errors1});
    }
    else{
      const username = req.body.username;
      const password = req.body.password;
      const password2 = req.body.password2;
      const name = req.body.name
      const surname = req.body.surname

      console.log( errors )
      if(errors){
        res.sendFile('/views/register.html', { root: '.', errors: errors});
      }
      else {
        var sql = "INSERT INTO User (username, password, name, surname) VALUES (?,?,?,?)";
        var values = [username, password, name, surname];
        conn.query(sql, values, function (err) {
          if (err) {
            throw err;
          }
          else{
            console.log("New User added to database!");
          }
        });
      }
    }
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  }
  else {
    conn.connect(function(err) {
      if (err) throw err;
      //Escape the address value:
      var sql = "SELECT password FROM User WHERE username = ?"
      //Send an array with value(s) to replace the escaped values:
      conn.query(sql, username, function (err, result) {
        if (err) {
          throw err;
        }
        else{
            if(result.password === password){
              console.log("Connected!");
            }
            else{
              console.log("User doesnt exist");
            }
        }
      });
    });
  }

});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
