var mysql      = require('mysql');
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
  var statusbool = false;
  var total = 0;
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
      res.json(json_res);
    }
  });
};

exports.create_a_shop = function(req, res) {
// TODO
};

exports.read_a_shop = function(req, res) {
//TODO
};

exports.update_a_shop = function(req, res) {
//TODO
};

exports.partial_update_shop = function(req, res) {
//TODO
};

exports.delete_a_shop = function(req, res) {
//TODO
};