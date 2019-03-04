var mysql      = require('mysql');
var jsontoxml      = require('jsontoxml');
var conn = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

conn.connect(function(err) {
    if (err) throw err; s
});

async function startcount(result, start, count){
  return new Promise( async function(resolve, reject){
    var result1 = [];
    for(i=start; i<start+count; i++){
      if(result[i]){
        await result1.push(result[i]);
      }
    }
    resolve(result1);
  });
}

exports.list_products = function(req, res) {
  var start = req.query.start;
  var count = req.query.count;
  var status = req.query.status;
  var sort = req.query.sort;
  var format = req.query.format;

  if(! start){
    start = 0;
  }
  if(! count){
    count = 20;
  }
  if(! status){
    status = "ACTIVE";
  }
  if(! sort){
    sort = "id|DESC";
  }
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

  var sql1 = `SELECT COUNT(*) AS total FROM Product_api`;
  conn.query(sql1, function (err, result1) {
    if (err) {
      throw err;
    }
    else{
      total = result1[0].total;
    }
  });
  var sql = `SELECT id,name, description, category, tags, withdrawn FROM Product_api WHERE ('withdrawn'= ${statusbool}) ORDER BY ${sort1[0]} ${sort1[1]} `;
  conn.query(sql, async function (err, result) {
    if (err) {
      throw err;
    }
    else {
      var result2 = await startcount(result, start, count, total);


      json_res = {
        "start": parseInt(start),
        "count": parseInt(count),
        "total": result2.length,
        "products":result2
      }
      for (var item in json_res.products){
        for (var ts in json_res.products[item]){
          if(ts === 'tags'){
            json_res.products[item][ts] = json_res.products[item][ts].replace(']', '').replace('[', '').split(",");
          }
        }
      }


      if(format == "json"){
        res.json(json_res);
        res.end();
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<results>"
        xml += jsontoxml({
          "start": parseInt(start),
          "count": parseInt(count),
          "total": parseInt(total)});
        xml += "<products>";
        for (var i in result) {
            xml +="<product>";
            xml += jsontoxml(result[i]);
            xml +="</product>";
        }
        xml += "</products>"
        xml += "</results>"
        res.send(xml);
        res.end();
      }
    }
  });
};

exports.create_a_product = async(req, res) => {
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
    res.end();
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

  var sql = "INSERT INTO Product_api (name, description, category, tags, username) VALUES (?,?,?,?,?)";
  if(! String(body.tags).includes(',')){
      var values = [body.name, body.description, body.category, '[' + body.tags + ']', user.username];
  }
  else{
      var values = [body.name, body.description, body.category, String(body.tags), user.username];
  }
  conn.query(sql, values, function (err) {
    if (err) {
      res.send("400 – Bad Request");
      res.end();
      return;
    }
    else{
      var sql1 = `SELECT * FROM Product_api WHERE (id = (SELECT MAX(id) FROM Product_api)) AND (name = '${body.name}')`
      conn.query(sql1, function (err, result) {
        if (err) {
          throw err;
        }
        else if(result == ''){  //can't find the product we just added, (If we get here something went terribly wrong)
          res.send("400 – Bad Request");
          res.end();
          return;
        }
        else{
          json_res = result;
          for (var item in json_res[0]){
            if(item === 'tags'){
              json_res[0][item] = json_res[0][item].replace(']', '').replace('[', '').split(",");
            }

          }
          if(format == "json"){
            res.json(json_res[0]);
            res.end();
          }
          else{
            res.set('Content-Type', 'text/xml');
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
            for (var i in result) {
              xml += jsontoxml(result[i]);
            }
            xml += "</product>"
            res.send(xml);
            res.end();
          }
        }
      });
    }
  });
};

exports.read_a_product = function(req, res) {
  var format = req.query.format;
  var id = req.params.id;
  if(! format){
    format = "json";
  }
  var sql1 = `SELECT id,name, description, category, tags FROM Product_api WHERE id = ${id}`;
  conn.query(sql1, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product with the given id
      res.send("404 – Not Found");
      res.end();
      return;
    }
    else{
      json_res = result;
      if(format == "json"){
        res.json(json_res[0]);
        res.end();
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</product>"
        res.send(xml);
        res.end();
      }
    }
  });
};

exports.update_a_product = async (req, res) =>{
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
  if(! format){
    format = "json";
  }

  var sql0 = `SELECT * FROM Product_api WHERE id = ${id}`;
  conn.query(sql0, async (err, result) =>{
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product with the given id
      res.send("404 – Not Found");
      res.end();
      return;
    }
    else{
      if ([body.name, body.description, body.category, body.tags, body.withdrawn].includes(undefined)){
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
        // if at this point user is undefined, we dont have correct authentication
        if([user].includes(undefined)){
          // if user is undefined, the authentication token given, does not correspond to any user
          // Σε περίπτωση που ένας μη διαπιστευμένος χρήστης δεν επιτρέπεται να εκτελέσει μια ενέργεια θα πρέπει να επιστρέφεται το 403 – Forbidden
          res.send("403 – Forbidden");
          res.end();
          return;
        }

        var sq = `SELECT * FROM Product_api WHERE (id = ${id}) AND ((username = '${user.username}') OR (username = 'admin'))`;
        conn.query(sq, function (err, result) {
          if (err) {
            throw err;
          }
          else if(result == ''){  //can't find the product with the given id
            // Σε περίπτωση που ένας διαπιστευμένος χρήστης δεν έχει τη δικαιοδοσία να εκτελέσει μια ενέργεια, θα πρέπει να επιστρέφεται το 401 Not Authorized
            res.send("401 – Not Authorized");
            res.end();
            return;
          }
        });
        if ( ! [body.name, body.description, body.category, body.tags, body.withdrawn].includes(undefined)){
          var sql = `UPDATE Product_api SET name = '${body.name}', description = '${body.description}', category = '${body.category}', tags = '${body.tags}', withdrawn = ${body.withdrawn} WHERE (id = '${id}')`
          conn.query(sql, function (err, result) {
            if (err) {
              throw err;
            }
          });
          var sql1 = `SELECT * FROM Product_api WHERE id = ${id}`;
          conn.query(sql1, function (err, result) {
            if (err) {
              throw err;
            }
            else if(result == ''){  //can't find the product we just updated, (If we get here something went terribly wrong)
              return;
            }
            else{
              json_res = result;
              if(format == "json"){
                res.json(json_res[0]);
                res.end();
              }
              else{
                res.set('Content-Type', 'text/xml');
                var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
                for (var i in result) {
                  xml += jsontoxml(result[i]);
                }
                xml += "</product>"
                res.send(xml);
                res.end();
              }
            }
          });
        }

      }
    }
  });

};

exports.partial_update_product = async(req, res) =>{
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
  if(! format){
    format = "json";
  }
  var sql0 = `SELECT * FROM Product_api WHERE id = ${id}`;
  conn.query(sql0, async (err, result) =>{
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product with the given id
      res.send("404 – Not Found");
      res.end();
      return;
    }
    else{
        if (Object.keys(body).length != 1){
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
          // if at this point user is undefined, we dont have correct authentication
          if([user].includes(undefined)){
            // if user is undefined, the authentication token given, does not correspond to any user
            // Σε περίπτωση που ένας μη διαπιστευμένος χρήστης δεν επιτρέπεται να εκτελέσει μια ενέργεια θα πρέπει να επιστρέφεται το 403 – Forbidden
            res.send("403 – Forbidden");
            res.end();
            return;
          }

          var sq = `SELECT * FROM Product_api WHERE (id = ${id}) AND ((username = '${user.username}') OR (username = 'admin'))`;
          conn.query(sq, async (err, result) =>{
            if (err) {
              throw err;
            }
            else if(result == ''){  //can't find the product with the given id
              // Σε περίπτωση που ένας διαπιστευμένος χρήστης δεν έχει τη δικαιοδοσία να εκτελέσει μια ενέργεια, θα πρέπει να επιστρέφεται το 401 Not Authorized
              res.send("401 – Not Authorized");
              res.end();
              return;
            }
            else{

            }
          });



          if(Object.keys(body).length == 1){
            var key = Object.keys(body)[0];
            var value = body[key];
            if (! ['name', 'description', 'category', 'tags', 'withdrawn'].includes(key)){
              res.send("400 – Bad Request");
              res.end();
              return;
            }
            else{
              var sql = `UPDATE Product_api SET ${key} = '${value}' WHERE (id = ${id})`
              conn.query(sql, function (err) {
                if (err) {
                  throw err;
                }
              });
              var sql1 = `SELECT * FROM Product_api WHERE id = ${id}`;
              conn.query(sql1, function (err, result) {
                if (err) {
                  throw err;
                }
                else if(result == ''){  //can't find the product we just updated, (If we get here something went terribly wrong)
                  return;
                }
                else{
                  json_res = result;
                  if(format == "json"){
                    res.json(json_res[0]);
                    res.end();
                  }
                  else{
                    res.set('Content-Type', 'text/xml');
                    var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
                    for (var i in result) {
                      xml += jsontoxml(result[i]);
                    }
                    xml += "</product>"
                    res.send(xml);
                    res.end();
                  }
                }
              });
            }
          }
        }
    }
  });


  };

exports.delete_a_product = async(req, res) =>{
  var format = req.query.format;
  var id = req.params.id;
  if(! format){
    format = "json";
  }


  var sql0 = `SELECT * FROM Product_api WHERE id = ${id}`;
  conn.query(sql0, async (err, result) =>{
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product with the given id
      res.send("404 – Not Found");
      res.end();
      return
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


      if([user].includes(undefined)){
        // if user is undefined, the authentication token given, does not correspond to any user
        // Σε περίπτωση που ένας μη διαπιστευμένος χρήστης δεν επιτρέπεται να εκτελέσει μια ενέργεια θα πρέπει να επιστρέφεται το 403 – Forbidden
        res.send("403 – Forbidden");
        res.end();
        return;
      }
      else if (user.username != 'admin'){
        var sql = `UPDATE Product_api SET withdrawn=1 WHERE (id = ${id}) && (username = ${user.username})`
        conn.query(sql, function (err, result) {
          if (err) {
            throw err;
          }
        });
        var sql1 = `SELECT * FROM Product_api WHERE (id = ${id})  && (username = ${user.username})`;
        conn.query(sql1, function (err, result) {
          if (err) {
            throw err;
          }
          else if(result == ''){  //can't find the product whose withdrawn state we just updated, (If we get here something went terribly wrong)
            return;
          }
          else{
            json_res = result;
            if(format == "json"){
              res.json({"message":"OK"});
              res.end();
            }
            else{
              res.set('Content-Type', 'text/xml');
              var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<message>OK</message>";
              res.send(xml);
              res.end();
            }
          }
        });
      }
      else {  // user type is Administrator
        var sql = `DELETE FROM Product_api WHERE (id = ${id})`
        conn.query(sql, function (err, result) {
          if (err) {
            throw err;
          }
        });
        var sql1 = `SELECT * FROM Product_api WHERE id = ${id}`;
        conn.query(sql1, function (err, result) {
          if (err) {
            throw err;
          }
          else if(result != ''){  //can find the product we just deleted, (If we get here something went terribly wrong)
            return;
          }
          else{
            json_res = result;
            if(format == "json"){
              res.json({"message":"OK"});
              res.end();
            }
            else{
              res.set('Content-Type', 'text/xml');
              var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<message>OK</message>";
              res.send(xml);
              res.end();
            }
          }
        });
      }
    }
  });


};
