'use strict';
var mongo = require("mongodb")
	, server = new mongo.Server("localhost", mongo.Connection.DEFAULT_PORT, {auto_reconnect: true, safe:true})
	, mdb = new mongo.Db("blog", server);

module.exports = {
  insertBlog: function(req, res) {
	  //Parse the data into title and content (add date, too)
	  var query = {"title": req.body.title, "content": req.body.content, "created": new Date().toISOString()};
	  
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
	  res.render('admin');
  }
}
