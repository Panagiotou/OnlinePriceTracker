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

// Shop search

router.get('/search', function(req, res){
  //-------------EDO-----------------
  var c_username='';
  var flag123 = false;
 if (req.session && req.session.username) {
       // Check if session exists and if username exists
      c_username = req.session.username;
   flag123 = true;
   }
   //--------------------------------
  var page = req.query.page;
  var sort = req.query.sort;
  if (!page) page = 1;
  var count = 24;
  var start = count * (page - 1);
  // Ελέγχοι για: Όνομα, Διεύθυνση, tags
  const name = req.query.name;
  const address = req.query.address;
  const tags = req.query.tags;
  var sql = "SELECT * FROM Shop_api";
  if (name || address || tags) {
    sql += " WHERE";
    var cnt = 0;
    if (name) {
      sql += " name LIKE '%" + name + "%'";
      cnt++;
    }
    if (address) {
      if (cnt) sql += " AND";
      sql += " address LIKE '%" + address + "%'";
      cnt++;
    }
    if (tags) {
      if (cnt) sql += " AND";
      sql += " (";
      var loo = tags.split(",");
      for(var i = 0; i < loo.length; i++){
        if (i > 0) sql += " OR";
        sql += " Tags LIKE '%" + loo[i] + "%'";
      }
      sql += " )";
    }
  }
  console.log(sql);
  conn.query(sql, function (err, result) {
    if (err) {
      let errors1 = [{ param: '', msg: 'Σφάλμα', value: '' }];
      res.render('shop_search', {errors: errors1, boollogin : flag123, username : c_username});
    }
    else if (result == '') {
      let errors1 = [{ param: '', msg: 'Δεν υπάρχει κατάστημα με αυτά τα tags.', value: '' }];
      res.render('shop_search', {errors: errors1, boollogin : flag123, username : c_username});
    }
    else {
      var lim = start + count;
      if (result.length < lim) lim = result.length;
      var page_ = page;
      var count_ = lim - start;
      var total_ = result.length;
      var shops_ = result.slice(start, lim);
      json_res = {
        "page": page_,
        "count": count_,
        "total": total_,
        "shops": shops_,
        "boollogin" : flag123,
        "username" : c_username
      };
      console.log("Loof: " + page + " " + count_ + " " + total_ + " " + shops_[0].name + "\n");
      console.log("Pif: " + json_res + "\n");
      res.render('shop_search', json_res);
    }
  });
});



// Login Form
router.get('/add', function(req, res){

  if (req.session && req.session.username) {
    //-------------EDO-----------------
    var c_username='';
    var flag123 = false;
   if (req.session && req.session.username) {
         // Check if session exists and if username exists
        c_username = req.session.username;
     flag123 = true;
     }
     //--------------------------------
    res.render('shop_add',{ boollogin : flag123, username : c_username });
  }
  else {
    res.redirect('/../login');
  }
});

// Add shop
router.post('/add', function(req, res){
  //-------------EDO-----------------
  var c_username='';
  var flag123 = false;
 if (req.session && req.session.username) {
       // Check if session exists and if username exists
      c_username = req.session.username;
   flag123 = true;
   }
   //--------------------------------
  if (req.session && req.session.username) {
    req.checkBody('name', 'Συμπληρώστε το πεδίο " Όνομα καταστήματος "').notEmpty();
    req.checkBody('address', 'Συμπληρώστε το πεδίο " Διεύθυνση "').notEmpty();
    req.checkBody('lng', 'Συμπληρώστε το πεδίο " Γεωγραφικό μήκος "').notEmpty();
    req.checkBody('lat', 'Συμπληρώστε το πεδίο " Γεωγραφικό πλάτος "').notEmpty();
    req.checkBody('tags', 'Συμπληρώστε το πεδίο " Tags "').notEmpty();
    let errors = req.validationErrors();
    if(errors){
      res.render('shop_add', {errors: errors, boollogin : flag123, username : c_username });
    }
    else{
      const name = req.body.name;
      const address = req.body.address;
      const lng = req.body.lng;
      const lat = req.body.lat;
      const tags = req.body.tags;
      var sql = "INSERT INTO Shop_api (name, address, lng, lat, tags) VALUES (?,?,?,?,?)";
      var values = [name, address, lng, lat, tags];
      conn.query(sql, values, function (err) {
        if (err) {
          let errors1 = [{ param: '', msg: 'Λάθος', value: '' }];
          res.render('shop_add', {errors: errors1, boollogin : flag123, username : c_username });
        }
        else{
          console.log("New Shop added to database!");
          req.flash('success_msg','Το κατάστημα προστέθηκε με επιτυχία!');
          res.redirect('/shops/search');
        }
      });
    }
  }
  else {
    res.redirect('/../login');
  }
});


//Delete Shop
router.get('/delete', function(req, res){
  if (req.session && req.session.username){
    //-------------EDO-----------------
    var c_username='';
    var flag123 = false;
   if (req.session && req.session.username) {
         // Check if session exists and if username exists
        c_username = req.session.username;
     flag123 = true;
     }
     //--------------------------------
    res.render('shop_delete',  {boollogin : flag123, username : c_username});
  }
  else {
    res.redirect('/../login');
  }
});

router.post('/delete', function(req, res){
  if (req.session && req.session.username) {
    //-------------EDO-----------------
    var c_username='';
    var flag123 = false;
   if (req.session && req.session.username) {
         // Check if session exists and if username exists
        c_username = req.session.username;
     flag123 = true;
     }
     //--------------------------------
    req.checkBody('id', 'Συμπληρώστε το πεδίο " ID "').notEmpty();
    let errors = req.validationErrors();
    if(errors){
      res.render('shop_delete', {errors: errors, boollogin : flag123, username : c_username});
    }
    else{
      var id = req.body.id;
      var sql = "SELECT id FROM Shop_api WHERE id=?";
      conn.query(sql, id, function (err, result) {
        if (err) {
          let errors1 = [{ param: '', msg: 'Λάθος', value: '' }];
          res.render('shop_delete', {errors: errors1, boollogin : flag123, username : c_username});
        }
        else if (result == '') {
          let errors1 = [{ param: '', msg: 'No shop with given ID.', value: '' }];
          res.render('shop_delete', {errors: errors1, boollogin : flag123, username : c_username});
        }
        else {
          console.log("Ready to delete shop");
          if (req.session.username == 'admin') {
            var sql = "DELETE FROM Shop_api WHERE id=?";
            conn.query(sql, id, function (err, result) {
              if (err) {
                let errors1 = [{ param: '', msg: 'Λάθος', value: '' }];
                res.render('shop_delete', {errors: errors1, boollogin : flag123, username : c_username});
              }
              else {
                console.log("Shop deleted from database!");
                req.flash('success_msg','Το κατάστημα διαγράφηκε με επιτυχία!');
                res.redirect('/shops/delete');
              }
            });
          }
          else {
            var sql = "UPDATE Shop_api SET withdrawn=1 WHERE id=?";
            conn.query(sql, id, function (err, result) {
              if (err) {
                let errors1 = [{ param: '', msg: 'Λάθος', value: '' }];
                res.render('shop_delete', {errors: errors1, boollogin : flag123, username : c_username});
              }
              else {
                console.log("Shop hided from database!");
                req.flash('success_msg','Το κατάστημα κρύφθηκε με επιτυχία!');
                res.redirect('/shops/search');
              }
            });
          }
        }
      });
    }
  }
  else {
    res.redirect('/../login');
  }
});

//Update shop
router.get('/update', function(req, res){
  if (req.session && req.session.username){
    //-------------EDO-----------------
    var c_username='';
    var flag123 = false;
   if (req.session && req.session.username) {
         // Check if session exists and if username exists
        c_username = req.session.username;
     flag123 = true;
     }
     //--------------------------------
    res.render('shop_update', { boollogin : flag123, username : c_username });
  }
  else {
    res.redirect('/../login');
  }
});

router.post('/update', function(req, res){
  if (req.session && req.session.username) {
    //-------------EDO-----------------
    var c_username='';
    var flag123 = false;
   if (req.session && req.session.username) {
         // Check if session exists and if username exists
        c_username = req.session.username;
     flag123 = true;
     }
     //--------------------------------
    req.checkBody('id', 'Συμπληρώστε το πεδίο " ID "').notEmpty();
    let errors = req.validationErrors();
    if(errors){
      res.render('shop_update', {errors: errors, boollogin : flag123, username : c_username});
    }
    else{
      var id = req.body.id;
      var sql = "SELECT * FROM Shop_api WHERE id=?";
      conn.query(sql, id, function (err, result) {
        if (err) {
          console.log("Error1");
          let errors1 = [{ param: '', msg: 'Σφάλμα', value: '' }];
          res.render('shop_update', {errors: errors1, boollogin : flag123, username : c_username});
        }
        else if (result == '') {
          let errors1 = [{ param: '', msg: 'Δεν υπάρχει κατάστημα με αυτό το ID.', value: '' }];
          res.render('shop_update', {errors: errors1, boollogin : flag123, username : c_username});
        }
        else {
          console.log("Ready to update shop");
          var sql = "UPDATE Shop_api SET name=?, address=?, lng=?, lat=?, tags=? WHERE id=?";
          var name = req.body.name;
          var address = req.body.address;
          var lng = req.body.lng;
          var lat = req.body.lat;
          var tags = req.body.tags;
          if (name == '') name = result[0].name;
          if (address == '') address = result[0].address;
          if (lng == '') lng = result[0].lng;
          if (lat == '') lat = result[0].lat;
          if (tags == '') tags = result[0].tags;
          var values = [name, address, lng, lat, tags, id];
          conn.query(sql, values, function (err, result) {
            if (err) {
              console.log('Error2');
              let errors1 = [{ param: '', msg: 'Σφάλμα', value: '' }];
              res.render('shop_update', {errors: errors1, boollogin : flag123, username : c_username});
            }
            else {
              console.log("Shop updated!");
              req.flash('success_msg','Το κατάστημα ενημερώθηκε με επιτυχία!');
              res.redirect('/shops/myshops');
            }
          });
        }
      });
    }
  }
});


router.post('/shop_details',function(req , res){
	 var c_username='';
	 var flag123 = false;
	 if (req.session && req.session.username) {
    		// Check if session exists and if username exists
   		 c_username = req.session.username;
		flag123 = true;
  	}
	var shop_id = (req.body.subject);
	var shop1;
	console.log(shop_id);
	var sql = `SELECT * FROM Shop_api WHERE id = ${shop_id}`;
      	      conn.query(sql, function (err, result) {
        if (err) {
          conlose.log("edo skaei");
          throw err;
        }
        else{
        	console.log(result);
        	res.render('shop_details',{shop : result, boollogin : flag123, username : c_username });
        }


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
	var ab = "dos,firikia";
	console.log(ab);

	const resultba = await testfunc(ab);
	console.log("END");
	console.log(resultba);
	res.redirect('../login');
});

module.exports = router;
