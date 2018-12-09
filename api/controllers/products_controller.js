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

exports.list_products = function(req, res) {
  var start = req.start;
  var count = req.count;
  var status = req.status;
  var sort = req.sort;
  var statusbool = false;
  if (status == 'ALL'){
    statusbool = "false OR withdrawn=true";
  }
  else if (status == 'WITHDRAWN'){
    statusbool = true;
  }
  var sort1 = sort.split("|");
  var sql = `SELECT * FROM Product WHERE (id BETWEEN ${start} AND ${count}) AND (withdrawn= ${statusbool}) ORDER BY ${sort1[0]} ${sort1[1]} `;
  conn.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    else {
      console.log(result);
    }
  });
};
exports.create_a_product = function(req, res) {
// TODO
};

exports.read_a_product = function(req, res) {
//TODO
};

exports.update_a_product = function(req, res) {
//TODO
};

exports.partial_update_product = function(req, res) {
//TODO
};

exports.delete_a_product = function(req, res) {
//TODO
};
