'use strict';
/**
 * External dependencies
 */
var express = require('express')
  , app = express()
  , http = require('http')
  , path = require('path');
 
/**
 * My code
 */
var routes = require('./routes')
  , helpers = require('./helpers');

//Stolen from defaults
app.configure(function() {
  app.set('port', process.env.PORT || 8888);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Set locals to settings stored in db
  helpers.getSettings(app);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.home);
app.get('/admin', routes.admin);
app.get('/admin/newPost', routes.newPost);
app.get('/admin/settings', routes.settings);
app.post('/admin/newPost', function(req, res) {
  res.render('newPost', helpers.insertPost(req, res));
});
app.post('/admin/settings', function(req, res) {
  res.render('settings', helpers.updateSettings(req, res));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
