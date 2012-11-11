'use strict';
var mongo = require('mongodb')
	, server = new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {auto_reconnect: true, safe:true})
	, mdb = new mongo.Db('blog', server);

module.exports = {
	home: function(req, res) {
		var blogs = '';
		//Load blogs from db
		mdb.open(function(err, db) {
			db.collection('blogs', function(err, collection) {
				var stream = collection.find({}, {'limit': 10, 'sort': {'created': -1}}).stream();
				stream.on('data', function(item) {
					req.app.render('blogItem', {title: item.title, content: item.content}, function(err, html) {
						if(err) { console.error(err);	return; }
						blogs += html;
					});
				});
				//Render the finished page
				stream.on('end', function() {
					res.render('home', {title: req.app.locals.title, blogs: blogs});
					db.close();
				});
			});
		});
	},
	admin: function(req, res) {
		res.render('admin');
	},
	newPost: function(req, res) {
		res.render('newPost');
	},
	settings: function(req, res) {
		res.render('settings');
	}
};
