"use strict";
var mongo = require("mongodb"),
	server = new mongo.Server("localhost", mongo.Connection.DEFAULT_PORT, {auto_reconnect: true, safe:true}),
	mdb = new mongo.Db("blog", server),
	querystring = require("querystring");
	
function home(response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write('<h1>AWESOME BLOG SITE</h1>');
    //Add a record to the db
    mdb.open(function(err, db) {
		db.collection("blogs", function(err, collection) {
			var stream = collection.find({}, {"limit": 10, "sort": "created"}).stream();
			stream.on("data", function(item) {
				console.log(item);
				response.write("<h4>" + item.title + "</h4>" + item.content);
			});
			stream.on("end", function() {
				response.write('<br/><a href="/admin">Admin</a>');
				response.end();
				db.close();
			});
		});
	});
}

function admin(response, postData) {
	if(postData) {
		insertBlog(postData);
	}
	response.writeHead(200, {"Content-Type": "text/html"});
    response.write('<h1>Admin section</h1>'+
		'<form action="/admin" method="post">'+
		'<input type="text" name="title"/> <br />'+
		'<textarea name="content" rows="10" cols="30"></textarea> <br />'+
		'<input type="submit" value="Submit" />'+
		'</form>'+
		'<a href="/">Main</a>'
    );
    response.end();
}

function insertBlog(postData) {
	var title = querystring.parse(postData).title,
		content = querystring.parse(postData).content;
	//Parse the data into title and content (add date, too)
	var query = {"title": title, "content": content, "created": new Date().toISOString()};
	
	mdb.open(function(err, db) {
		db.collection("blogs", function(err, collection) {
			collection.insert(query, {safe:true}, function(err, records) {
				if(err) {
					console.log("Error on blog insert: " + err);
					db.close();
					return;
				}
				console.log("Inserted: " + records[0]);
				db.close();
			});
		});
	});
}

exports.home = home;
exports.admin = admin;
