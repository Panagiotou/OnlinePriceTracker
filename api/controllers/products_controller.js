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

exports.list_products = function(req, res) {
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
  var sql = `SELECT * FROM Product_api WHERE ('id' BETWEEN ${start} AND ${count}) AND ('withdrawn'= ${statusbool}) ORDER BY '${sort1[0]}' ${sort1[1]} `;
  conn.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    else {
      json_res = {
        "start": start,
        "count": count,
        "total": total,
        "products":result
      }
      if(format == "json"){
        res.json(json_res);
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<results>"
        xml += jsontoxml({
          "start": start,
          "count": count,
          "total": total});
        xml += "<products>";
        for (var i in result) {
            xml +="<product>";
            xml += jsontoxml(result[i]);
            xml +="</product>";
        }
        xml += "</products>"
        xml += "</results>"
        res.send(xml);
      }
    }
  });
};

exports.create_a_product = function(req, res) {
  var format = req.query.format;
  var body = req.body;
  if(! format){
    format = "json";
  }
  var sql = "INSERT INTO Product_api (name, description, category, tags) VALUES (?,?,?,?)";
  var values = [body.name, body.description, body.category, body.tags];
  conn.query(sql, values, function (err) {
    if (err) {
      res.send("400 – Bad Request");
      return;
    }
  });
  var sql1 = `SELECT * FROM Product_api WHERE (id = (SELECT MAX(id) FROM Product_api)) AND (name = '${body.name}')`
  conn.query(sql1, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product we just added, (If we get here something went terribly wrong)
      res.send("400 – Bad Request");
      return;
    }
    else{
      json_res = result;
      if(format == "json"){
        res.json(json_res);
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</product>"
        res.send(xml);
      }
    }
  });
};

exports.read_a_product = function(req, res) {
  var format = req.query.format;
  var id = req.params.id;
  if(! format){
    format = "json";
  }
  var sql1 = `SELECT * FROM Product_api WHERE id = ${id}`;
  conn.query(sql1, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product with the given id
      res.send("404 – Not Found");
      return;
    }
    else{
      json_res = result;
      if(format == "json"){
        res.json(json_res);
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</product>"
        res.send(xml);
      }
    }
  });
};

exports.update_a_product = function(req, res) {
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
  if(! format){
    format = "json";
  }
  var sql0 = `SELECT * FROM Product_api WHERE id = ${id}`;
  conn.query(sql0, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product with the given id
      res.send("404 – Not Found");
      return;
    }
    else{
      if ([body.name, body.description, body.category, body.tags, body.withdrawn].includes(undefined)){
        console.log("Then im here, how is this possible???");
        res.send("400 – Bad Request");
        return;
      }
    }
  });

  console.log("First im here");
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
        res.json(json_res);
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</product>"
        res.send(xml);
      }
    }
  });
};

exports.partial_update_product = function(req, res) {
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
  if(! format){
    format = "json";
  }
  var sql0 = `SELECT * FROM Product_api WHERE id = ${id}`;
  conn.query(sql0, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the product with the given id
      res.send("404 – Not Found");
      return;
    }
  });

  if (body.length != 1){
    res.send("400 – Bad Request");
    return;
  }



  var key = Object.keys(body)[0];
  var value = body[key];
  var sql = `UPDATE Product_api SET ${key} = '${value}' WHERE (id = '${id}')`
  conn.query(sql, function (err) {
    if (err) {
      throw err;
    }
    else{  //can't find the product with the given id
      res.send("404 – Not Found");
      return;
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
        res.json(json_res);
      }
      else{
        res.set('Content-Type', 'text/xml');
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<product>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</product>"
        res.send(xml);
      }
    }
  });
  };

exports.delete_a_product = function(req, res) {
//TODO
};
