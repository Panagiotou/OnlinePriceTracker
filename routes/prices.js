
const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
//var https = require('https')
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

async function shopfunc(){
	var resultb;

	return new Promise(async function(resolve , reject){
	var sql12345 = "SELECT * FROM Shop_api "
	conn.query(sql12345 ,async (err, resultb)=> {
	if (err) {
		throw err;
	}
	else{
		resolve(resultb);
	}
	});
	});
}

async function prodfunc(){
	var resultb;

	return new Promise(async function(resolve , reject){
	var sql1234 = "SELECT * FROM Product_api "
	conn.query(sql1234 ,async (err, resultb)=> {
	if (err) {
		throw err;
	}
	else{
		resolve(resultb);
	}
	});
	});
}

//products add get
router.get('/prices_add',async function(req , res){
	var shops_out;
	var products_out;
	// After loggin, this will change router file
  	var c_username='';
  	var flag123 = false;

	if (req.session && req.session.username) {
        	c_username = req.session.username;
		flag123 = true;
	}
	shops_out  = await shopfunc();
	products_out = await prodfunc();	
    // Check if session exists and if username exists
    //find shop , product
    	res.render('add_price', {Shop : shops_out, Product :products_out, boollogin : flag123, username : c_username });
});

//products add post
router.post('/prices_add',async function(req , res){
	 var c_username='';
	 var flag123 = false;
	// After loggin, this will change router file
	if (req.session && req.session.username) {
	var c_username=req.session.username;
	 var flag123 = true;
	 }
	var shops_out  = await shopfunc();
	var products_out = await prodfunc();
	// Check if session exists and if username exists
	req.checkBody('price_in', 'Συμπληρώστε το πεδίο " Τιμή  "').notEmpty();
	req.checkBody('dateFrom', 'Συμπληρώστε το πεδίο " Ημερομηνία έναρξης "').notEmpty();
	req.checkBody('dateTo', 'Συμπληρώστε το πεδίο " Ημερομηνία Λήξης "').notEmpty();
	req.checkBody('product_select', 'Συμπληρώστε το πεδίο " Όνομα προιόντος "').notEmpty();
	req.checkBody('shop_select', 'Συμπληρώστε το πεδίο " Όνομα καταστήματος "').notEmpty();
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('add_price', {errors: errors,Shop : shops_out, Product :products_out, boollogin : flag123, username : c_username});
  	}
  	else{
  		var price = req.body.price_in;
		var dateFrom = req.body.dateFrom;
		var dateTo = req.body.dateTo;
		var product_id = req.body.product_select;
		var shop_id =  req.body.shop_select;
		console.log(dateFrom);
		console.log(dateTo);
		var sql1 = "INSERT INTO Price_api (price, dateFrom, dateTo, productId,shopId) VALUES (?,?,?,?,?)";
      		var values = [price,dateFrom,dateTo, product_id, shop_id];
      		conn.query(sql1, values, function (err) {
		if (err) {
			throw err;
		}
		else{
			//Succesfull add display message?
			req.flash('success_msg','Η προσθήκη σας ολοκληρώθηκε με επιτυχία.');
          		res.redirect('/prices/prices_add');
		}
		});
	}

  

});

//products delete get
router.get('/prices_delete',function(req , res){
	var c_username='';
	 var flag123 = false;
// After loggin, this will change router file
  if (req.session && req.session.username =='admin') {
   	var c_username=req.session.username;
	 var flag123 = true;
    // Check if session exists and if username exists
    res.render('delete_price',{boollogin : flag123, username : c_username});

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

});

//products delete post
router.post('/prices_delete',function(req , res){
	var c_username='';
	 var flag123 = false;
	// After loggin, this will change router file
	if (req.session && req.session.username =='admin') {

	var c_username=req.session.username;
	 var flag123 = true;
	// Check if session exists and if username exists
	req.checkBody('id_in', 'Συμπληρώστε το πεδίο "ID Προσφοράς "').notEmpty();
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('delete_price', {errors: errors,boollogin : flag123, username : c_username});
  	}
  	else{
  		var id_in = req.body.id_in;
		var username_in = req.session.username;
		var sql1 = "DELETE FROM Price_api WHERE id = ?";
      		conn.query(sql1, id_in, function (err) {
		if (err) {
			throw err;
		}
		else{
			//Succesfull add display message?
			req.flash('success_msg','Η διαγραφή σας ολοκληρώθηκε με επιτυχία.');
          		res.redirect('/prices/prices_delete');
		}
		});
	}

  } else {
   req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
   res.redirect('../login');
  }

});



//products update post
router.post('/prices_update',function(req , res){
	var flags=0;

	var c_username='';
	 var flag123 = false;
	// After loggin, this will change router file
	if (req.session && req.session.username ) {
	var c_username=req.session.username;
	 var flag123 = true;
	// Check if session exists and if username exists
	//req.checkBody('id_in', 'Συμπληρώστε το πεδίο "ID Προιόντος "').notEmpty();
	console.log(req.body.id_in);
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('update_product', {errors: errors ,boollogin : flag123, username : c_username });
  	}
  	else{
  		var id_in = req.body.id_in;
  		var name_in = req.body.name_in;
  		if(name_in){
  			var sql1 = `UPDATE Product_api SET name = '${name_in}' WHERE id =  ${id_in}`;
  			console.log(sql1);
  			conn.query(sql1,  function (err) {
			if (err) {
				throw err;

			}
			else{
				flags=1;
			}
			});
  		}
		var description_in = req.body.description_in;
		if(description_in){
  			var sql2 = `UPDATE Product_api SET description = '${description_in}' WHERE id = ${id_in}`;
  			conn.query(sql2, function (err) {
			if (err) {
				throw err;
			}
			else{
				flags=1;
			}
			});
  		}
		var category_in = req.body.category_in;
		if(category_in){
  			var sql3 = `UPDATE Product_api SET category = '${category_in}' WHERE id = ${id_in}`;
  			conn.query(sql3,  function (err) {
			if (err) {
				throw err;
			}
			else{
				flags=1;
			}
			});
  		}
		var tags_in = req.body.tags_in;
		if(tags_in){
  			var sql4 = `UPDATE Product_api SET tags = '${tags_in}' WHERE id = ${id_in}`;
  			conn.query(sql4,  function (err) {
			if (err) {
				throw err;
			}
			else{
				flags=1;
			}
			});
  		}
		//Succesfull add display message?
  		//res.redirect('../products');

		req.flash('success_msg','Η ανανέωση σας ολοκληρώθηκε με επιτυχία.');
		res.redirect('/products/myproducts');




	}

  } else {
   req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
   res.redirect('../login');
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




module.exports = router;
