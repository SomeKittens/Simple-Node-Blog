'use strict';
var mongo = require("mongodb")
	, server = new mongo.Server("localhost", mongo.Connection.DEFAULT_PORT, {auto_reconnect: true, safe:true})
	, mdb = new mongo.Db("blog", server);

module.exports = {
  insertBlog: function(req, res) {
    //Parse the data into title and content (add date, too)
    var query = {'title': req.body.postTitle, 'content': req.body.content, 'created': new Date().toISOString()};
    
    mdb.open(function(err, db) {
      db.collection('blogs', function(err, collection) {
        collection.insert(query, {safe:true}, function(err, records) {
          if(err) {
            console.log('Error on blog insert: ' + err);
            db.close();
            return;
          }
          console.log('Inserted: ' + records[0]);
          db.close();
        });
      });
    });
    //res.render('newPost');
  },
  getSettings: function(app) {
    mdb.open(function(err, db) {
      db.collection('settings', function(err, collection) {
        //Using findOne since there should only be one set of settings
        collection.findOne({}, function(err, document) {
          if(err) {
            console.error('Error getting settings: ' + err);
          } else if (document) {
            delete document._id; //Not needed in settings
            app.locals = document;
          } else {
            console.log('No settings found');
          }
          db.close();
        });
      });
    });
  },
  updateSettings: function(req, res) {
    mdb.open(function(err, db) {
      db.collection('settings', function(err, collection) {
        var newSettings = {title: req.body.blogTitle};
        collection.update({}, newSettings, function(err, document) {
          if(err) {
            console.error('Error setting settings: ' + err);
            return;
          }
          req.app.locals = newSettings;
          db.close();
        });
      });
    });
    res.render('settings');
  }
};
