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


router.get('/products_add',function(req , res){
	
// After loggin, this will change router file
  if (req.session && req.session.username) {
    // Check if session exists and if username exists
    res.render('add_product');

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

});


router.post('/products_add',function(req , res){
	
	// After loggin, this will change router file
	if (req.session && req.session.username) {
	// Check if session exists and if username exists
	req.checkBody('name_in', 'Συμπληρώστε το πεδίο " Όνομα Προιόντος "').notEmpty();
	req.checkBody('description_in', 'Συμπληρώστε το πεδίο " Περιγραφή Προιόντος "').notEmpty();
	req.checkBody('category_in', 'Συμπληρώστε το πεδίο " Κατηγορία Προιόντος "').notEmpty();
	req.checkBody('tags_in', 'Συμπληρώστε το πεδίο " Tags Προιόντος "').notEmpty();
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('add_product', {errors: errors});
  	}
  	else{
  		var name_in = req.body.name_in;
		var description_in = req.body.description_in;
		var category_in = req.body.category_in;
		var tags_in = req.body.tags_in;
		var username = req.session.username;
		var sql1 = "INSERT INTO Product_api (name, description, category, tags, username) VALUES (?,?,?,?,?)";
      		var values = [name_in,description_in,category_in, tags_in, username_in];
      		conn.query(sql1, values, function (err) {
		if (err) {
			throw err;
		}
		else{
			//Succesfull add display message?
			req.flash('success_msg','Η προσθήκη σας ολοκληρώθηκε με επιτυχία.');
          		res.redirect('/logged_in');
		}
		});
	}	     

  } else {
   req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
   res.redirect('../login');
  }

});


module.exports = router;




