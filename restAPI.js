var express = require('express');
var fs = require("fs");
var bp = require("body-parser")

var app = express();
app.use(bp.json());

app.get('/listUsers', function (req, res){
	fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
		console.log( data);
		res.end (data);
	});
})

app.post('/addUser', function (req, res) {
	fs.readFile( __dirname + "/" + "users.json", 'utf8', function(err,data) {
		console.log("req is: "+req.body);
		var newUser = req.body;
		console.log(newUser)
		res.send(req.body)
		res.end("foo")
	})
})

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("RESTful app running at http://%s:%s", host, port);
})