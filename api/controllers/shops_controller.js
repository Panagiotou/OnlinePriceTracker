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

exports.list_shops = function(req, res) {
  var start = req.query.start;
  var count = req.query.count;
  var status = req.query.status;
  var sort = req.query.sort;
  var format = req.query.format;
  if(! format){
    format = "json";
  }
  var statusbool = false;
  var total = 0;
  if ( [start, count, status, sort].includes(undefined) || [start, count, status, sort].includes(null) ){
    res.send("400 – Bad Request");
    res.end();
    return;
  }
  if (status == 'ALL'){
    statusbool = "false OR withdrawn=true";
  }
  else if (status == 'WITHDRAWN'){
    statusbool = true;
  }
  var sort1 = sort.split("|");

  var sql1 = `SELECT COUNT(*) AS total FROM Shop_api`;
  conn.query(sql1, function (err, result1) {
    if (err) {
      throw err;
    }
    else{
      total = result1[0].total;
    }
  });
  var sql = `SELECT * FROM Shop_api WHERE ('id' BETWEEN ${start} AND ${count}) AND ('withdrawn'= ${statusbool}) ORDER BY '${sort1[0]}' ${sort1[1]} `;
  conn.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    else {
      json_res = {
        "start": start,
        "count": count,
        "total": total,
        "shops":result
      }
      if(format == "json"){
        res.json(json_res);
        res.end();
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<results>"
        xml += jsontoxml({
          "start": start,
          "count": count,
          "total": total});
        xml += "<shops>";
        for (var i in result) {
            xml +="<shop>";
            xml += jsontoxml(result[i]);
            xml +="</shop>";
        }
        xml += "</shops>"
        xml += "</results>"
        res.send(xml);
        res.end();
      }
    }
  });
};

exports.create_a_shop = async(req, res) =>{
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
  if(([user].includes(undefined)) || ([authentication].includes(undefined) || [authentication].includes(null)) ){
    // if user is undefined, the authentication token given, does not correspond to any user
    // Σε περίπτωση που ένας μη διαπιστευμένος χρήστης δεν επιτρέπεται να εκτελέσει μια ενέργεια θα πρέπει να επιστρέφεται το 403 – Forbidden
    res.send("403 – Forbidden");
    res.end();
    return;
  }


  var sql = "INSERT INTO Shop_api (name, address, lng, lat, tags) VALUES (?,?,?,?,?)";
  var values = [body.name, body.address, parseFloat(body.lng), parseFloat(body.lat), body.tags];
  conn.query(sql, values, function (err) {
    if (err) {
      res.send("400 – Bad Request");
      res.end();
      return;
    }
    else{
      var sql1 = `SELECT * FROM Shop_api WHERE (id = (SELECT MAX(id) FROM Shop_api)) AND (name = '${body.name}')`
      conn.query(sql1, function (err, result) {
        if (err) {
          throw err;
        }
        else if(result == ''){  //can't find the shop we just added, (If we get here something went terribly wrong)
          res.send("400 – Bad Request");
          res.end();
          return;
        }
        else{
          json_res = result;
          if(format == "json"){
            res.json(json_res[0]);
          }
          else{
            res.set('Content-Type', 'text/xml');
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<shop>"
            for (var i in result) {
              xml += jsontoxml(result[i]);
            }
            xml += "</shop>"
            res.send(xml);
          }
        }
      });
    }
  });

};

exports.read_a_shop = function(req, res) {
  var format = req.query.format;
  var id = req.params.id;
  if(! format){
    format = "json";
  }
  var sql1 = `SELECT * FROM Shop_api WHERE id = ${id}`;
  conn.query(sql1, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the shop with the given id
      res.send("404 – Not Found");
      res.end();
      return;
    }
    else{
      json_res = result;
      if(format == "json"){
        res.json(json_res[0]);
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<shop>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</shop>"
        res.send(xml);
        res.end();
      }
    }
  });
};

exports.update_a_shop = async(req, res) =>{
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
  if(! format){
    format = "json";
  }

  var sql0 = `SELECT * FROM Shop_api WHERE id = ${id}`;
  conn.query(sql0, async (err, result) =>{
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the shop with the given id
      res.send("404 – Not Found");
      res.end();
      return;
    }
    else{
      if ([body.name, body.address, body.lng, body.lat, body.tags, body.withdrawn].includes(undefined)){
        res.send("400 – Bad Request");
        res.end();
        return;
      }
      else{
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
          res.end();
          return;
        }

        if(! [body.name, body.address, body.lng, body.lat, body.tags, body.withdrawn].includes(undefined)){
          var sql = `UPDATE Shop_api SET name = '${body.name}', address = '${body.address}', lng = '${parseFloat(body.lng)}', lat = '${parseFloat(body.lat)}', tags = '${body.tags}', withdrawn = ${body.withdrawn} WHERE (id = '${id}')`
          conn.query(sql, function (err, result) {
            if (err) {
              throw err;
            }
          });
        var sql1 = `SELECT * FROM Shop_api WHERE id = ${id}`;
          conn.query(sql1, function (err, result) {
            if (err) {
              throw err;
            }
            else if(result == ''){  //can't find the shop we just updated, (If we get here something went terribly wrong)
              return;
            }
            else{
              json_res = result;
              if(format == "json"){
                res.json(json_res[0]);
              }
              else{
                res.set('Content-Type', 'text/xml');
                var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<shop>"
                for (var i in result) {
                  xml += jsontoxml(result[i]);
                }
                xml += "</shop>"
                res.send(xml);
              }
            }
          });
        }
      }
    }
  });


};

exports.partial_update_shop = async(req, res) =>{
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
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

  var sql0 = `SELECT * FROM Shop_api WHERE id = ${id}`;
  conn.query(sql0, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the shop with the given id
      res.send("404 – Not Found");
      return;
    }
    else{
      if (Object.keys(body).length != 1){
        res.send("400 – Bad Request");
        return;
      }
      else{
        if(Object.keys(body).length == 1){
          var key = Object.keys(body)[0];
          var value = body[key];
          if (! ['name', 'address', 'lng', 'lat', 'tags', 'withdrawn'].includes(key)){
            res.send("400 – Bad Request");
            return;
          }
          else{
            var sql = `UPDATE Shop_api SET ${key} = '${value}' WHERE (id = ${id})`
            conn.query(sql, function (err) {
              if (err) {
                throw err;
              }
            });
            var sql1 = `SELECT * FROM Shop_api WHERE id = ${id}`;
            conn.query(sql1, function (err, result) {
              if (err) {
                throw err;
              }
              else if(result == ''){  //can't find the shop we just updated, (If we get here something went terribly wrong)
                return;
              }
              else{
                json_res = result;
                if(format == "json"){
                  res.json(json_res[0]);
                }
                else{
                  res.set('Content-Type', 'text/xml');
                  var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<shop>"
                  for (var i in result) {
                    xml += jsontoxml(result[i]);
                  }
                  xml += "</shop>"
                  res.send(xml);
                }
              }
            });
          }
        }
      }
    }
  });


};

exports.delete_a_shop = async(req, res) =>{
  var format = req.query.format;
  var id = req.params.id;
  if(! format){
    format = "json";
  }

  var sql0 = `SELECT * FROM Shop_api WHERE id = ${id}`;
  conn.query(sql0, async (err, result) => {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the shop with the given id
      res.send("404 – Not Found");
      return;
    }
    else{
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


      if (user_type == 'Volunteer'){  // FIXME (how is user type recognized?)
        var sql = `UPDATE Shop_api SET withdrawn = 1 WHERE (id = '${id}')`
        conn.query(sql, function (err, result) {
          if (err) {
            throw err;
          }
          else if(result == ''){  //can't find the product with the given id
            res.send("404 – Not Found");
            return;
          }
        });
        var sql1 = `SELECT * FROM Shop_api WHERE id = ${id}`;
        conn.query(sql1, function (err, result) {
          if (err) {
            throw err;
          }
          else if(result == ''){  //can't find the shop whose withdrawn state we just updated, (If we get here something went terribly wrong)
            return;
          }
          else{
            json_res = result;
            if(format == "json"){
              res.json({"message":"OK"});
            }
            else{
              res.set('Content-Type', 'text/xml');
              var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<message>OK</message>";
              res.send(xml);
            }
          }
        });
      }
      else {  // user type is Administrator
        var sql = `DELETE FROM Shop_api WHERE (id = '${id}')`
        conn.query(sql, function (err, result) {
          if (err) {
            throw err;
          }
        });
        var sql1 = `SELECT * FROM Shop_api WHERE id = ${id}`;
        conn.query(sql1, function (err, result) {
          if (err) {
            throw err;
          }
          else if(result != ''){  //can find the shop we just deleted, (If we get here something went terribly wrong)
            return;
          }
          else{
            json_res = result;
            if(format == "json"){
              res.json({"message":"OK"});
            }
            else{
              res.set('Content-Type', 'text/xml');
              var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<message>OK</message>";
              res.send(xml);
            }
          }
        });
      }
    }
  });


};
