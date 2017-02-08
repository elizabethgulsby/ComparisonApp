var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.userName,
  password : config.password,
  database : config.database
});

// after this line runs, we are connected to mySQL!
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
