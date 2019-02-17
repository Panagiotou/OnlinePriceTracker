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
    await new Promise((resolve, reject) => {
      var sql = `SELECT authentication_token FROM User_api WHERE (username = 'username' && password = 'password') `;
      inDB = '';
      conn.query(sql, function (err, result) {
        if (err) {
          throw err;
        }
        else{
          inDB = result[0].authentication_token;
          resolve();
        }
      });
    });
      if(  body['authentication_token'] == inDB){
        console.log("True");
      }
      else{
        console.log("False");
      }
      callback();
  });
}

function test_logout_post(callback){
  // Test /logout POST
  console.log("Testing /logout POST ... ");
  // TODO

  callback();
}

function test_products_get(callback){
  // Test /products GET
  console.log("Testing /products GET ... ");
  // TODO

  callback();
}

function test_products_post(callback){
  // Test /products POST
  console.log("Testing /products POST ... ");
  // TODO

  callback();
}

function test_products_id_get(callback){
  // Test /products/:id GET
  console.log("Testing /products/:id GET ... ");
  // TODO

  callback();
}

function test_products_id_post(callback){
  // Test /products/:id POST
  console.log("Testing /products/:id POST ... ");
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

test_login_post(function(){
  test_logout_post(function(){
    test_products_get(function(){
      test_products_post(function(){
        test_products_id_get(function(){
          test_products_id_post(function(){
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
