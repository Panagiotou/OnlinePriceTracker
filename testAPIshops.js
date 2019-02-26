var mysql      = require('mysql');
const baseurl = "http://localhost:8765/observatory/api";
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

function test_shops_get(callback){
  // Test /products GET
  console.log("Testing /test_shops_post GET ... ");
  // TODO

  callback();
}

function test_shops_post(callback){
  // Test /shops POST
  console.log("Testing /shops POST ... ");
  var request = require('request');
    request({
      url: baseurl + '/shops',
      method: 'POST',
      headers: {'X-OBSERVATORY-AUTH': 'authentication_token'},
      body: {'name': 'name', 'address': 'address', 'lng': '0', 'lat': '0', 'tags': 'tags'},
      json: true
    }, async(error, response, body) => {
      var expected = {
          "name": "name",
          "address": "address",
          "lng": "0",
          "lat": "0",
          "tags": "tags",
        }
      var got = body;
      if(expected.name == got.name && expected.address == got.address && expected.lng == got.lng && expected.lat == got.lat && expected.tags == got.tags){
        console.log("True");
      }
      else{
        console.log("False");
      }
      callback();
      });
  }

function test_shops_id_get(callback){
  // Test /shops/:id GET
  console.log("Testing /shops/:id GET ... ");
  // TODO

  callback();
}

function test_shops_id_put(callback){
  // Test /shops/:id POST
  console.log("Testing /shops/:id PUT ... ");
  // TODO

  callback();
}

function test_shops_id_patch(callback){
  // Test /shops/:id PATCH
  console.log("Testing /shops/:id PATCH ... ");
  // TODO

  callback();
}

function test_shops_id_delete(callback){
  // Test /shops/:id DELETE
  console.log("Testing /shops/:id DELETE ... ");

  // TODO

  callback();
  process.exit();
  // This is the last function so we do process.exit() at the end
}

create_test_user(function(){
  test_logout_post(function(){
    test_login_post(function(){
      update_test_user(function(){
        test_shops_post(function(){
          test_shops_get(function(){
            test_shops_id_get(function(){
              test_shops_id_put(function(){
                test_shops_id_patch(function(){
                  test_shops_id_delete(function(){
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
