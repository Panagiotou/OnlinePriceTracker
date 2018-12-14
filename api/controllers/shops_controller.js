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
      }
    }
  });
};

exports.create_a_shop = function(req, res) {
  var format = req.query.format;
  var body = req.body;
  if(! format){
    format = "json";
  }
  if(body.withdrawn == 'true' || body.withdrawn == '1'){ //make the string input a boolean value
    var w = true;
  }
  else if(body.withdrawn == 'false' || body.withdrawn == '0'){
    var w = false;
  }
  var sql = "INSERT INTO Shop_api (name, address, lng, lat, tags, withdrawn) VALUES (?,?,?,?,?,?)";
  var values = [body.name, body.address, parseFloat(body.lng), parseFloat(body.lat), body.tags , w];
  conn.query(sql, values, function (err) {
    if (err) {
      res.send("400 – Bad Request");
      return;
    }
  });
  var sql1 = `SELECT * FROM Shop_api WHERE (id = (SELECT MAX(id) FROM Shop_api)) AND (name = '${body.name}')`
  conn.query(sql1, function (err, result) {
    if (err) {
      throw err;
    }
    else if(result == ''){  //can't find the shop we just added, (If we get here something went terribly wrong)
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
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8?\">\n<shop>"
        for (var i in result) {
          xml += jsontoxml(result[i]);
        }
        xml += "</shop>"
        res.send(xml);
      }
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
      return;
    }
    else{
      json_res = result;
      if(format == "json"){
        res.json(json_res);
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
};

exports.update_a_shop = function(req, res) {
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
  if(! format){
    format = "json";
  }
  if ([body.name, body.address, body.lng, body.lat, body.tags, body.withdrawn].includes(undefined)){
    res.send("400 – Bad Request");
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
  });

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
        res.json(json_res);
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
};

exports.partial_update_shop = function(req, res) {
  var format = req.query.format;
  var body = req.body;
  var id = req.params.id;
  if(! format){
    format = "json";
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
  });

  if (Object.keys(body).length != 1){
    res.send("400 – Bad Request");
    return;
  }

  var key = Object.keys(body)[0];
  var value = body[key];
  var sql = `UPDATE Shop_api SET ${key} = '${value}' WHERE id = ${id}`
  console.log(sql);
  conn.query(sql, function (err) {
    if (err) {
      throw err;
    }
    else{  //can't find the shop with the given id
      console.log("here");
      res.send("404 – Not Found");
      return;
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
        res.json(json_res);
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
};

exports.delete_a_shop = function(req, res) {
//TODO
};
