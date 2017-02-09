var express = require('express');
var router = express.Router();
// Include config files that are in gitignore
var config = require('../config/config.js');
// Include mysql module to connect to MySQL
var mysql = require('mysql');
// Set up a connection to use over and over
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
	var getImagesQuery = "select * from images";

	//don't want them to be able to select the same image more than once
	getImagesQuery = "select * from images where id not in" + 
	"(select ImageID from votes where ip = '"+req.ip+"');"
	// need an error handler (see if statement before res.render)

	connection.query(getImagesQuery, function(error, results, fields) {
		// res.json(results); - make sure results from query are displaying
		// grab a random images from the results
		var randomIndex = (Math.floor(Math.random() * results.length));
		// res.json(results[randomIndex]);
		if (results.length == 0) {
			res.render('index', { msg: "noImages" });
		} else {
			res.render('index', {
				title: 'Electric or Not',
				imageToRender: '/images/' + results[randomIndex].imageUrl,
				imageID: results[randomIndex].id
			});
		}
	})
});

router.get('/vote/:voteDirection/:imageID', function (req, res, next) {
	var imageID = req.params.imageID;
	var voteD = req.params.voteDirection;
	if (voteD == 'up') {
		voteD = 1;
	}
	else {
		voteD = -1;
	}
	var insertVoteQuery = "INSERT INTO votes (ip, imageId, voteDirection) VALUES ('"+req.ip+"',"+imageID+",'"+voteD+"')";
	// res.json(insertVoteQuery);
	// res.json(req.params.voteDirection);
	connection.query(insertVoteQuery, function(error, results, fields) {
		if (error) throw error;
		res.redirect('/');
 	})
});


// getting standings page
router.get('/standings', function(req, res, next) {

});

//sql injection practice route
router.get('/testQ', function (req, res, next) {
	// var id1 = [1];
	// var id2 = [3];
	// var query = "select * from images where id > ? AND id < ?";
	// connection.query(query,[id1, id2], function(error, results, fields) {
	// 	res.json(results);
	// })

	//running this manually, inserting values upon each refresh
	var imageIdVoted = 5;
	var thisvoteDirection = -1;
	var insertQuery = "insert into votes (ip, ImageID, voteDirection) values(?, ?, ?)";
	connection.query(insertQuery, [req.ip, imageIdVoted, thisvoteDirection], function (error, results, fields) {
		var query = "select * from votes";
		connection.query(query, function (error, results, fields) {
			res.json(results);
		});
	})
});

module.exports = router;
