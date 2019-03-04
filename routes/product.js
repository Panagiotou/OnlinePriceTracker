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





async function processarr(b) {
	var telos=[];

	//console.log(b);
	return new Promise(async function(resolve , reject){
	var sql1234 = "SELECT id FROM Product_api WHERE name = ?"
	conn.query(sql1234, b ,async (err, resultb)=> {
	if (err) {
		throw err;
	}
	else{
		for (var iterator of resultb){
				var xesto;
				xesto = iterator.id;
				telos.push(xesto);
		}
		resolve(telos);


	}
	});
	});
}



async function testfunc (a) {

	var listProducts;
	var telos=[];
	return new Promise(async function(resolve , reject){
	listProducts = a.split(",");
	for(i=0; i<listProducts.length; i++){

		var tempt = await processarr(listProducts[i]);
		
		telos= telos.concat(tempt);

	}
	resolve(telos);
	 });

}



//products changed
router.get('/',function(req , res){
	var resulta;
	//sql to get all shop names,ids
	var sql123 = "SELECT * FROM Shop_api "
      		conn.query(sql123,  function (err, resulta) {
        if (err) {
          throw err;
        }
        else{


	 var c_username='';
	 var flag123 = false;
	if (req.session && req.session.username) {
    		// Check if session exists and if username exists
   		 c_username = req.session.username;
		flag123 = true;
  	}

	var Request = require("request");
        //this remains
       

	const d1 = new Date(2011,10,30);
	const d2 = new Date(2020,10,30);
        let request_options = {
			url : "https://localhost:8765/observatory/api/prices",
			method : 'GET',
			qs: {
				start : '',
				count : '',
				geoDist :'',
				geoLng :'',
				geoLat :'',
				dateFrom:d1,
				dateTo:d2,
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
	else{
			let request_out = JSON.parse(body);
			var start_out=request_out.start;
			var count_out=request_out.count;
			var total_out=request_out.total;
			var prices_out = request_out.prices;
			var temp=0;
			var fresult =[];
			res.render('home',{Product : prices_out,Shop : resulta ,boollogin : flag123, username : c_username});
	}

	/*let result;
	var testvariable=1;
	var product1;
	var sql = "SELECT * FROM Product_api "
      	      conn.query(sql, function (err, result) {
        if (err) {
          throw err;
        }
        else{
        	//console.log(result);
        	res.render('home',{Product : result, boollogin : flag123, username : c_username});
        }
	*/

	      //Send data to front end to render
	      //productlist should contain all info needed to render
	      //res.render('products',{productlist : result,testi :testvariable});
	//});

	});
}
});
});

//Post Homepage?
//changed function to async

router.post('/', async function(req,res,next){
	var product_name = req.body.productname ;
	var final_product_id = [];
	
	if(product_name){
		var resultba = await testfunc(product_name);
		
		resultba = resultba.join();
		

		final_product_id  =  resultba;
	}
	var geoDist_in = req.body.distance;
	
	//final_product_id = await testfunc(product_name);

	var resulta;
	//sql to get all shop names,ids
	var sql123 = "SELECT * FROM Shop_api "
      conn.query(sql123,  function (err, resulta) {
        if (err) {
          throw err;
        }
        else{

         var c_username='';
	 var flag123 = false;
	 if (req.session && req.session.username) {
    		// Check if session exists and if username exists
   		 c_username = req.session.username;
		flag123 = true;
  	}
  	var tags_in = req.body.tags;
	var  start_in = req.body.start_in;
	var count_in = req.body.count_in;
	
	
	var geoLng_in = req.body.lng_in;
	console.log(geoLng_in);
	var geoLat_in = req.body.lat_in;
	console.log(geoLat_in);
	var dateFrom_in = req.body.dateFrom;
	var dateTo_in = req.body.dateTo;
	var shops_in = req.body.shop_select;
	var sort_in = req.body.sort;
	//var product_name = req.body.productname ;
	var search_button;
	var test_var ='';
	//find product_names from ids

	if(product_name){
		//final_product_id =  testfunc(product_name);

	}
	search_button = 1;
	if(search_button == 1){
		//Above are the possibly filters? based on the make a get query
		//Get request using the api


	     	var Request = require("request");

		geoLng_in
		if (geoDist_in){
			var test_lng = 37.9929;
			var test_lat = 23.7274;
		}
		let request_options = {
			url : "https://localhost:8765/observatory/api/prices",
			method : 'GET',
			qs: {
				start : '',
				count : '',
				geoDist :geoDist_in,
				geoLng :geoLng_in,
				geoLat :geoLat_in,
				dateFrom:dateFrom_in,
				dateTo:dateTo_in,
				shops:shops_in,
				products:final_product_id,
				tags:tags_in,
				sort:sort_in
        	     	}
        	}
      		console.log(final_product_id);

      		Request(request_options,(error,response,body) => {
		if(error){
			return console.dir(error);
		}
		else{


		//console.dir(JSON.parse(body));
		//All viarables returned from the json object after parsing it
		let request_out = JSON.parse(body);
		var start_out=request_out.start;
		var count_out=request_out.count;
		var total_out=request_out.total;
		var prices_out = request_out.prices;
		var temp=0;
		var fresult =[];

		console.log(prices_out);
		console.log(prices_out.length);
		/*for(var iterator of prices_out) {
			 //var result = new Object;
			 //result.name = iterator.productName;
			 var result;
			 var sqlt = `SELECT * FROM Product_api WHERE id =  ${iterator.productId}`;
      	      		 conn.query(sqlt, function (err, result) {
        			if (err) {
          				throw err;
        			}
        			else{
        			 fresult.push(result);
        			 console.log(fresult);
        			}
			});
			 //result.description = "temp";
    			 //result.id = iterator.productId;
       			 //console.log(result.name);
       			 temp++;
    		}
    		*/
    		res.render('home',{Product :prices_out,Shop : resulta, boollogin : flag123, username : c_username });
		}

		});

		//How the hell does this work to return actual info is beyond me
		/*
    		while(temp<=prices_out.length){
    		 	if(temp==prices_out.lenght){
    		 	res.render('home',{Product : fresult, boollogin : flag123, username : c_username });
    		 	temp++;
    		 	}
    		}
    		console.log(fresult.length);*/

		//How the hell does this work to return actual info is beyond me


		//Render same page with new filters
		//productlist should contain all info needed to render
      		//res.render('home',{productlist : result,testi :testvariable});
      		//result contains a Product_api table , boollogin , username
		//res.render('home',{Product : result, boollogin : flag123, username : c_username });
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

	}
});

});


//products add get
router.get('/products_add',function(req , res){

// After loggin, this will change router file
  var c_username='';
  var flag123 = false;

  if (req.session && req.session.username) {
        c_username = req.session.username;
	flag123 = true;
    // Check if session exists and if username exists
    	res.render('add_product', { boollogin : flag123, username : c_username });

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

});

//products add post
router.post('/products_add',function(req , res){
	 var c_username='';
	 var flag123 = false;
	// After loggin, this will change router file
	if (req.session && req.session.username) {
	var c_username=req.session.username;
	 var flag123 = true;
	// Check if session exists and if username exists
	req.checkBody('name_in', 'Συμπληρώστε το πεδίο " Όνομα Προιόντος "').notEmpty();
	req.checkBody('description_in', 'Συμπληρώστε το πεδίο " Περιγραφή Προιόντος "').notEmpty();
	req.checkBody('category_in', 'Συμπληρώστε το πεδίο " Κατηγορία Προιόντος "').notEmpty();
	req.checkBody('tags_in', 'Συμπληρώστε το πεδίο " Tags Προιόντος "').notEmpty();
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('add_product', {errors: errors, boollogin : flag123, username : c_username});
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
          		res.redirect('/products/myproducts');
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
	var c_username='';
	 var flag123 = false;
// After loggin, this will change router file
  if (req.session && req.session.username =='admin') {
   	var c_username=req.session.username;
	 var flag123 = true;
    // Check if session exists and if username exists
    res.render('delete_product',{boollogin : flag123, username : c_username});

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

});

//products delete post
router.post('/products_delete',function(req , res){
	var c_username='';
	 var flag123 = false;
	// After loggin, this will change router file
	if (req.session && req.session.username =='admin') {

	var c_username=req.session.username;
	 var flag123 = true;
	// Check if session exists and if username exists
	req.checkBody('id_in', 'Συμπληρώστε το πεδίο "ID Προιόντος "').notEmpty();
	//Possibly add shop name??
  	let errors = req.validationErrors();
  	if(errors){
    		res.render('delete_product', {errors: errors,boollogin : flag123, username : c_username});
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
          		res.redirect('/products/myproducts');
		}
		});
	}

  } else {
   req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
   res.redirect('../login');
  }

});

//products update get
router.post('/products_updatep',function(req , res){
	var c_username='';
	 var flag123 = false;
// After loggin, this will change router file
  if (req.session && req.session.username ) {
    var c_username=req.session.username;
	 var flag123 = true;
    console.log(req.body.subject);

    // Check if session exists and if username exists
    res.render('update_product',{idp : req.body.subject, boollogin : flag123, username : c_username});

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

});

//products update post
router.post('/products_update',function(req , res){
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

router.get('/myproducts',function(req , res){

// After loggin, this will change router file
   var c_username='';
	 var flag123 = false;
	if (req.session && req.session.username) {
    		// Check if session exists and if username exists
   		 c_username = req.session.username;
		flag123 = true;
    	var sql = "SELECT * FROM Product_api WHERE username = ? "
      	      conn.query(sql,req.session.username ,function (err, result) {
        if (err) {
          throw err;
        }
        else{
        	//console.log(result);
        	res.render('myproducts_products',{Product : result, boollogin : flag123, username : c_username});
        }

	      //Send data to front end to render
	      //productlist should contain all info needed to render
	      //res.render('products',{productlist : result,testi :testvariable});
	});

  } else {
    req.flash('error','Δεν υπάρχει πρόσβαση στον ιστότοπο, απαιτείται να γίνει "ΣΥΝΔΕΣΗ".');
    res.redirect('../login');
  }

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
        	console.log(result);
        	res.render('product_details_products',{prod : result, boollogin : flag123, username : c_username });
        }

	      //Send data to front end to render
	      //productlist should contain all info needed to render
	      //res.render('products',{productlist : result,testi :testvariable});
	});
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

router.get('/testroute',async function(req,res,next){
	res.render('test');
});


module.exports = router;
