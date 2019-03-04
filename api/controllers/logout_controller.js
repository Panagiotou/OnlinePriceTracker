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

exports.logout_user = async (req, res) =>{
  var format = req.query.format;
  var body = req.body;
  if(! format){
    format = "json";
  }
  var authentication = req.headers['x-observatory-auth'];
  if (! ([authentication].includes(undefined) || [authentication].includes(null)) ){
    var sql0 = `SELECT * FROM User_api WHERE authentication_token = '${authentication}'`;
    await new Promise((resolve, reject) => {
      conn.query(sql0, function (err, result) {
        if (err) {
          throw(err);
        }
        else{
         user = result[0];
         resolve();
        }
      });
    });
  }
  else{
    res.send("403 – Forbidden");
    return;
  }

  var sql0 = `UPDATE User_api SET authentication_token = '' WHERE authentication_token = '${authentication}'`;
  await new Promise((resolve, reject) => {
    conn.query(sql0, function (err, result) {
      if (err) {
        res.send("400 – Bad Request");
        return;
      }
      else{
        myres = result;
        resolve();
      }
    });
  });
  if(myres.changedRows == 0){
    res.send("400 – Bad Request");
    return;
  }
  else{
    if(format == "json"){
      res.json({"message": "OK"});
    }
    else{
      res.set('Content-Type', 'text/xml');
      var xml = `<message> OK </message>`;
      res.send(xml);
    }
  }
}
