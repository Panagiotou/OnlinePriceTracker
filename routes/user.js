const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

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

// After loggin, this will change router file
router.get('/logged_in', function(req, res){
  if (req.session && req.session.username) {
    // Check if session exists and if username exists
    res.render('logged_in');

  } else {
    req.flash('error','You dont have access to this site, please login first.');
    res.redirect('/login');
  }
});

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  let errors = req.validationErrors();
  if(errors){
    res.render('register', {errors: errors});
  }
  else{
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    let errors1 = req.validationErrors();
    if(errors1){
      res.render('register', {errors: errors1});
    }
    else{
      const username = req.body.username;
      const password = req.body.password;
      const password2 = req.body.password2;
      const name = req.body.name
      const surname = req.body.surname
      var sql = "INSERT INTO User (username, password, name, surname) VALUES (?,?,?,?)";
      var values = [username, password, name, surname];
      conn.query(sql, values, function (err) {
        if (err) {
          if(err.code === 'ER_DUP_ENTRY'){
            let errors3 = [{ param: 'username', msg: 'User already exists', value: '' }];
            req.session.username = username; // Keep the username in this session.
            res.render('register', {errors: errors3});
          }
        }
        else{
          console.log("New User added to database!");
          req.flash('success_msg','You are now registered and can log in');
          res.redirect('/login');
        }
      });
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
    res.render('login', {
      errors:errors
    });
  }
  else {
      var sql = "SELECT password FROM User WHERE username = ?"
      conn.query(sql, username, function (err, result) {
        if (err) {
          throw err;
        }
        else{
            if(result[0].password === password){
              req.session.username = username;
              req.flash('success_msg','You are now logged in');
              res.redirect('/logged_in'); // after login go to logged in
            }
            else{
              let errors1 = [{ param: '', msg: 'You have entered an invalid username or password', value: '' }];
              res.render('login', {errors: errors1});
            }
        }
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
