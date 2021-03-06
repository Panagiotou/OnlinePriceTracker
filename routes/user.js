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
    var username = req.session.username;
    res.render('/logged_in',{username : username});

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

      //var sql = "INSERT INTO User_api (username, password,authentication_token,name,s ) VALUES (?,?,?)";
      //name , surname dont exist in DB ? add them to values too
      //var values = [username, password, ''];

      var sql = "INSERT INTO User_api (username, password, name, surname) VALUES (?,?,?,?)";
      //console.log("step 1");
      var values = [username, password, name, surname];

      conn.query(sql, values, function (err) {
        if (err) {
          if(err.code === 'ER_DUP_ENTRY'){
            let errors3 = [{ param: 'username', msg: 'Το " Όνομα χρήστη " που επιλέξατε χρησιμοποιείται', value: '' }];
            req.session.username = username; // Keep the username in this session.
            res.render('register', {errors: errors3});
          }
          else {
            throw err;
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
      var sql = "SELECT password FROM User_api WHERE username = ?"
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
                //req.flash('success_msg','Επιτυχής Σύνδεση');
                res.redirect('/products'); // after login go to logged in
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
  //req.logout();
  //req.session = null;
  //req.logout();
  delete req.session.username;
  req.flash('success_msg', 'Έγινε Αποσύνδεση');
  res.redirect('/login');
});


// Display products details
router.post('/product_details',function(req , res){
	 var c_username='';
	 var flag123 = false;
	 if (req.session && req.session.username) {
    		// Check if session exists and if username exists
   		 c_username = req.session.username;
		flag123 = true;
  	}
	var product_id = (req.body.subject);
	var product1;
	console.log(product_id);
	var sql = `SELECT * FROM Product_api WHERE id = ${product_id}`;
      	      conn.query(sql, function (err, result) {
        if (err) {
          conlose.log("edo skaei");
          throw err;
        }
        else{
        	res.render('home',{Product : result, boollogin : flag123, username : c_username });
        }

	      //Send data to front end to render
	      //productlist should contain all info needed to render
	      //res.render('products',{productlist : result,testi :testvariable});
	});
});








module.exports = router;
