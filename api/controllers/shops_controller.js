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
// TODO
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

exports.update_a_shop = function(req, res) {
//TODO 12
};

exports.partial_update_shop = function(req, res) {
//TODO
};

exports.delete_a_shop = function(req, res) {
//TODO
};
