"use strict";
//Require other files
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

//Create autoloader/handler
var handle = {};
handle["/"] = requestHandlers.home;
handle["/admin"] = requestHandlers.admin;

//Execute the thing:
server.start(router.route, handle);
