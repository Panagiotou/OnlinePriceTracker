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
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('/login');
  }
});

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  req.checkBody('username', 'Συμπληρώστε το πεδίο " Όνομα χρήστη "').notEmpty();
  req.checkBody('password', 'Συμπληρώστε το πεδίο " Κωδικός πρόσβασης "').notEmpty();
  req.checkBody('name', 'Συμπληρώστε το πεδίο " Όνομα "').notEmpty();
  req.checkBody('surname', 'Συμπληρώστε το πεδίο " Επώνυμο "').notEmpty();
  let errors = req.validationErrors();
  if(errors){
    res.render('register', {errors: errors});
  }
  else{
    req.checkBody('password2', 'Οι Κωδικοί πρόσβασης είναι διαφορετικοί').equals(req.body.password);
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
            let errors3 = [{ param: 'username', msg: 'Το " Όνομα χρήστη " που επιλέξατε χρησιμοποιείται', value: '' }];
            req.session.username = username; // Keep the username in this session.
            res.render('register', {errors: errors3});
          }
        }
        else{
          console.log("New User added to database!");
          req.flash('success_msg','Η εγγραφή σας ολοκληρώθηκε με επιτυχία, μπορείτε να συνδεθείτε');
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

  req.checkBody('username', 'Συμπληρώστε το πεδίο " Όνομα χρήστη "').notEmpty();
  req.checkBody('password', 'Συμπληρώστε το πεδίο " Κωδικός πρόσβασης "').notEmpty();

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
            if(result.length == 0){
              let errors1 = [{ param: '', msg: 'Λάθος " Όνομα χρήστη " ή " Κωδικός πρόσβασης "', value: '' }];
              res.render('login', {errors: errors1});
            }
            else{
              if(result[0].password === password){
                req.session.username = username;
                req.flash('success_msg','Επιτυχής Σύνδεση');
                res.redirect('/logged_in'); // after login go to logged in
              }
              else{
                let errors1 = [{ param: '', msg: 'Λάθος " Όνομα χρήστη " ή " Κωδικός πρόσβασης "', value: '' }];
                res.render('login', {errors: errors1});
              }
            }
        }
      });

  }
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Έγινε Αποσύνδεση');
  res.redirect('/users/login');
});

module.exports = router;
