var mysql      = require('mysql');
var jsontoxml      = require('jsontoxml');
var conn = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

conn.connect(function(err) { 
    if (err) throw err;
});

exports.login_user = function(req, res) {
  var format = req.query.format;
  var body = req.body;
  if(! format){
    format = "json";
  }
  if ( [body.username, body.password].includes(undefined) || [body.username, body.password].includes(null) ){
    res.send("400 – Bad Request");
    return;
  }
  var random_string_length8 = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
  if((body.username == 'admin') && (body.password == 'admin')){
    random_string_length8 = 'admin';
  }
  var sql0 = `UPDATE User_api SET authentication_token = '${random_string_length8}' WHERE ((username = '${body.username}') AND (password = '${body.password}')) `;
  conn.query(sql0, function (err) {
    if (err) {
      throw err;
    }
  });

  var sql = `SELECT password FROM User_api WHERE (username = '${body.username}') `;

  conn.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){
      res.send("404 – Not Found");
      return;
    }
    else{
      if(result[0].password == body.password){
        // authentication succesfull, generate authentication token and put it into database

        if(format == "json"){
          res.json({"token": random_string_length8});
        }
        else{
          res.set('Content-Type', 'text/xml');
          var xml = `<token> ${random_string_length8} </token>`;
          res.send(xml);
        }
      }
      else{
        res.send("400 – Bad Request");
      }
    }
  });
}
