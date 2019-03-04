var mysql      = require('mysql');
const baseurl = "https://localhost:8765/observatory/api";
require('dotenv').config() // require passwords and usernames etc from .env file

var conn = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});
 
conn.connect(function(err) {
    if (err) throw err;
});

function test_login_post(callback){
  // Test /login POST
  console.log("Testing /login POST ... ");
  var request = require('request');
  request({
    url: baseurl + '/login',
    method: 'POST',
    body: {'username': 'username', 'password': 'password'},
    json: true
  }, async(error, response, body) => {
      var sql = `SELECT authentication_token FROM User_api WHERE (username = 'username' && password = 'password') `;
      inDB = '';
      conn.query(sql, function (err, result) {
        if (err) {
          throw err;
        }
        else if(result == ''){
          console.log("False");
        }
        else{
          inDB = result[0].authentication_token;
          if(  body['authentication_token'] == inDB){
            console.log("True");
          }
          else{
            console.log("False");
          }
        }
        callback();
      });
    });
}

function test_logout_post(callback){
  // Test /logout POST
  console.log("Testing /logout POST ... ");
  var request = require('request');
  request({
    url: baseurl + '/logout',
    method: 'POST',
    headers: {'X-OBSERVATORY-AUTH': 'authentication_token'},
    json: true
  }, async(error, response, body) => {
      var sql = `SELECT * FROM User_api WHERE (authentication_token = 'authentication_token') `;
      conn.query(sql, function (err, result) {
        if (err) {
          throw err;
        }
        else if(result == ''){
          console.log("True");
        }
        else{
          console.log("False");
        }
        callback();
      });
    });
}

function create_test_user(callback){
  // Create a test user
  var sql0 = "SELECT * FROM User_api WHERE username = 'username'";
  conn.query(sql0, function (errq, result) {
      if (errq){
        throw errq;
      }
      else{
        if(result == ''){
          var sql = "INSERT INTO User_api (username, password, authentication_token) VALUES ('username', 'password', 'authentication_token')";
          conn.query(sql, function (errq) {
              if (errq){ throw errq;}
              console.log("Test User with values (username = 'username', password = 'password', authentication_token = 'authentication_token') Created");
          });
        }
        else{
          console.log("Test User with values (username = 'username', password = 'password', authentication_token = 'authentication_token') Created");
        }
        callback();
      }
  });
}

function update_test_user(callback){
  // Create a test user
  var sql0 = "UPDATE User_api SET authentication_token = 'authentication_token' WHERE username = 'username'";
  conn.query(sql0, function (errq, result) {
      if (errq){
        throw errq;
      }
      else{
        callback();
      }
  });
}

function test_products_post(callback){
  // Test /products POST
  console.log("Testing /products POST ... ");
  var request = require('request');
  request({
    url: baseurl + '/products',
    method: 'POST',
    headers: {'X-OBSERVATORY-AUTH': 'authentication_token'},
    body: {'name': 'name', 'description': 'description', 'category': 'category', 'tags': 'tags'},
    json: true
  }, async(error, response, body) => {
    var expected = {
        "name": "name",
        "description": "description",
        "category": "category",
        "tags": "tags",
      }
    var got = body;
    if(expected.name == got.name && expected.description == got.description && expected.category == got.category && expected.tags == got.tags){
      console.log("True");
    }
    else{
      console.log("False");
    }
    callback();
    });
}

function test_products_get(callback){
  // Test /products GET
  console.log("Testing /products GET ... ");
  // TODO
  var request = require('request');
  request({
    url: baseurl + '/products',
    method: 'GET',
    query:{"start": "0", "count": "1"},
    json: true
  }, async(error, response, body) => {
    console.log(body);
  });
}

function test_products_id_get(callback){
  // Test /products/:id GET
  console.log("Testing /products/:id GET ... ");
  // TODO

  callback();
}

function test_products_id_put(callback){
  // Test /products/:id POST
  console.log("Testing /products/:id PUT ... ");
  // TODO

  callback();
}

function test_products_id_patch(callback){
  // Test /products/:id PATCH
  console.log("Testing /products/:id PATCH ... ");
  // TODO

  callback();
}

function test_products_id_delete(callback){
  // Test /products/:id DELETE
  console.log("Testing /products/:id DELETE ... ");

  // TODO

  callback();
  process.exit();
  // This is the last function so we do process.exit() at the end
}

create_test_user(function(){
  test_logout_post(function(){
    test_login_post(function(){
      update_test_user(function(){
        test_products_post(function(){
          test_products_get(function(){
            test_products_id_get(function(){
              test_products_id_put(function(){
                test_products_id_patch(function(){
                  test_products_id_delete(function(){
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
