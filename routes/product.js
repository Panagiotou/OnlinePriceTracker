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






//products changed
router.get('/',function(req , res){
	 var c_username='';
	 var flag123 = false;
	if (req.session && req.session.username) {
    		// Check if session exists and if username exists
   		 c_username = req.session.username;
		flag123 = true;	
  	}
	let result;
	var testvariable=1;
	var product1;
	var sql = "SELECT * FROM Product_api "
      	      conn.query(sql, function (err, result) {
        if (err) {
          throw err;
        }
        else{
        	res.render('home',{Product : result, boollogin : flag123, username : c_username});
        }
	
	      //Send data to front end to render
	      //productlist should contain all info needed to render
	      //res.render('products',{productlist : result,testi :testvariable});
	});
});

//Post Homepage?

router.post('/',function(req,res){
	var  start_in = req.body.start_in;
	var count_in = req.body.count_in;
	var geoDist_in = req.body.geoDist;
	var geoLng_in = req.body.geoLng_in;
	var geoLat_in = req.body.geoLat_in;
	var dateFrom_in = req.body.dateFrom_in;
	var dateTo_in = req.body.dateTo_in;
	var shops_in = req.body.shops_in;
	var tags_in = req.body.tags_in;
	var sort_in = req.body.sort_in;
	var selected_product = req.body.selected ;
	var search_button = req.body.search_button;
	//Test set
	search_button = 1;
	if(search_button == 1){
		//Above are the possibly filters? based on the make a get query 
		//Get request using the api
	 	//test variables for date lets hope it works
	 	var cDate  =new Date();
	 	var tDate = new Date(2019,3,4,0,0,0,0);
	     	
	     	var Request = require("request");
		
		let request_options = {
			url : "http://localhost:8765/observatory/api/prices",
			method : 'GET',
			qs: {
				start : '',
				count : '',
				geoDist :'',
				geoLng :'',
				geoLat :'',
				dateFrom:cDate,
				dateTo:tDate,
				shops:'',
				products:'',
				tags:'',
				sort:''
        	     	}       	
        	}
      		
      		Request(request_options,(error,response,body) => {
		if(error){
		return console.dir(error);
		}
		//console.dir(JSON.parse(body));
		//All viarables returned from the json object after parsing it
		let request_out = JSON.parse(body); 
		var start_out=request_out.start;
		var count_out=request_out.count; 
		var total_out=request_out.total;
		var prices_out = request_out.prices;
		console.log(prices_out.length);
		//How the hell does this work to return actual info is beyond me
  		    });			
		//Render same page with new filters
		//productlist should contain all info needed to render
      		res.render('products',{productlist : result,testi :testvariable}); 
	}
	else {
	
		//display the specified product details page
		//this depends whether he sumbited through Search button or View details
		let result1
		var sql1 = "SELECT * FROM Product_api WHERE id = selected_product "
      		conn.query(sql1, function (err, result1) {
		res.render('display_products_details',{product_details : result1 });
		 if (err) {
        		  throw err;
        	}
        	else{
        		//render all details of selected product
        		res.render('products',{productlist : result,testi :testvariable});
        	}
	
	      //Send data to front end to render
	      //productlist should contain all info needed to render
	      //res.render('products',{productlist : result,testi :testvariable});
		});
	} 
});


//products add get
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

//products add post
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
		var username_in = req.session.username;
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

//products delete get
router.get('/products_delete',function(req , res){
	
// After loggin, this will change router file
  if (req.session && req.session.username =='admin') {
    // Check if session exists and if username exists
    res.render('delete_product');

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

});

//products delete post
router.post('/products_delete',function(req , res){
	
	// After loggin, this will change router file
	if (req.session && req.session.username =='admin') {
	// Check if session exists and if username exists
	req.checkBody('id_in', 'Συμπληρώστε το πεδίο "ID Προιόντος "').notEmpty();
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('delete_product', {errors: errors});
  	}
  	else{
  		var id_in = req.body.id_in;
		var username_in = req.session.username;
		var sql1 = "DELETE FROM Product_api WHERE id = ?";
      		conn.query(sql1, id_in, function (err) {
		if (err) {
			throw err;
		}
		else{
			//Succesfull add display message?
			req.flash('success_msg','Η διαγραφή σας ολοκληρώθηκε με επιτυχία.');
          		res.redirect('/logged_in');
		}
		});
	}	     

  } else {
   req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
   res.redirect('../login');
  }

});

//products update get
router.get('/products_update',function(req , res){
	
// After loggin, this will change router file
  if (req.session && req.session.username ) {
    // Check if session exists and if username exists
    res.render('update_product');

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

});

//products update post
router.post('/products_update',function(req , res){
	var flags=0;
	// After loggin, this will change router file
	if (req.session && req.session.username ) {
	// Check if session exists and if username exists
	req.checkBody('id_in', 'Συμπληρώστε το πεδίο "ID Προιόντος "').notEmpty();
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('update_product', {errors: errors});
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
		
		req.flash('success_msg','Η ανανέωση σας ολοκληρώθηκε με επιτυχία.');
  		res.redirect('../logged_in');
		
		
		
			
	}	     

  } else {
   req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
   res.redirect('../login');
  }

});






module.exports = router;



