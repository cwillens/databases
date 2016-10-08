var models = require('../models');
var fs = require('fs');
var Promise = require('bluebird');
var querystring = require('querystring');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/JSON'
};

module.exports = {
  messages: {
    options: function(req, res) {
      res.writeHead(200, headers);

    },
    get: function (req, res) {
      res.writeHead(200, headers);

      //var getPromise = Promise.promisify(models.messages.get);

      models.messages.get(function(rows) {
        res.end(JSON.stringify(rows));       
      });


    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var responseBody = {headers: headers, method: req.method, url: req.url };
      res.writeHead(201, headers);
      res.end(JSON.stringify(responseBody));

      models.messages.post(req.body);

    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      var responseBody = {headers: headers, method: req.method, url: req.url };
      res.writeHead(201, headers);
      res.end(JSON.stringify(responseBody));
      models.users.post(req.body);
    }
  },

  friends: {
    get: function(req, res) {
      res.writeHead(200, headers);
      var splitter = req.url.split('=');
      var id = Number(splitter[splitter.length - 1]);
      models.friends.get(id, function(rows) {
        res.end(JSON.stringify(rows));       
      });
    },
    post: function (req, res) {
      var responseBody = {headers: headers, method: req.method, url: req.url };
      res.writeHead(201, headers);
      res.end(JSON.stringify(responseBody));
      models.friends.post(req.body);
    }
  }
};

