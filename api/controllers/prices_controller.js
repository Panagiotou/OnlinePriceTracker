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

exports.list_prices = async(req, res) => {
  /*
  var start = req.query.start;
  var count = req.query.count;
  var geoDist = req.query.geoDist;
  var geoLng = req.query.geoLng;
  var geoLat = req.query.geoLat;
  var dateFrom = req.query.dateFrom;
  var dateTo = req.query.dateTo;
  var shops = req.query.shops;
  var products = req.query.products;
  var tags = req.query.tags;
  var sort = req.query.sort;

  var format = req.query.format;
  if(! format){
    format = "json";
  }

  if((geoDist || geoLat || geoLng) && (! (geoDist && geoLat && geoLng)){
      res.send("400 – Bad Request");
      return;
  }

  if((dateFrom || dateTo) && (! (dateFrom && dateTo))){
      res.send("400 – Bad Request");
      return;
  }

  //TODO


*/
};

exports.create_a_price = async(req, res) => {
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
  // if at this point user is undefined, we dont have correct authentication
  if([user].includes(undefined)){
    // if user is undefined, the authentication token given, does not correspond to any user
    // Σε περίπτωση που ένας μη διαπιστευμένος χρήστης δεν επιτρέπεται να εκτελέσει μια ενέργεια θα πρέπει να επιστρέφεται το 403 – Forbidden
    res.send("403 – Forbidden");
    return;
  }

  if ( [body.price, body.dateFrom, body.dateTo, body.productId, body.shopId].includes(undefined) || [body.price, body.dateFrom, body.dateTo, body.productId, body.shopId].includes(null) ){
    res.send("400 – Bad Request");
    return;
  }

  var sql = "INSERT INTO Price_api (price, dateFrom, dateTo, productId, shopId) VALUES (?,?,?,?,?)";
  var values = [body.price, body.dateFrom, body.dateTo, body.productId, body.shopId];

  conn.query(sql, values, function (err) {
    if (err) {
      res.send("400 – Bad Request");
      return;
    }
  });
  var sql1 = `SELECT * FROM Price_api WHERE (id = (SELECT MAX(id) FROM Price_api))`
  conn.query(sql1, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the price we just added, (If we get here something went terribly wrong)
      res.send("400 – Bad Request");
      return;
    }
    else{
      json_res = result;
      dbFrom = new Date(json_res[0].dateFrom.toISOString().split('T')[0]);
      nextFrom = new Date(dbFrom);
      nextFrom.setDate(dbFrom.getDate()+1);
      dbTo = new Date(json_res[0].dateTo.toISOString().split('T')[0]);
      nextTo = new Date(dbTo);
      nextTo.setDate(dbTo.getDate()+1);
      json_res[0].dateFrom = nextFrom.toISOString().split('T')[0];
      json_res[0].dateTo = nextTo.toISOString().split('T')[0];
      if(format == "json"){
        res.json(json_res[0]);
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<price>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</price>"
        res.send(xml);
      }
    }
  });
};
