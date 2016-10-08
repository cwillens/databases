var models = require('../models');
var fs = require('fs');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/JSON'
};

module.exports = {
  messages: {
    get: function (req, res) {}, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log('running controller messages post');
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      console.log('our post is running');
      var collectData = '';
      var responseBody = {headers: headers, method: req.method, url: req.url };
      res.writeHead(201, headers);
      res.end(JSON.stringify(responseBody));

      models.users.post(req.body);



      /*
      console.log('req', req);
      req.on('error', function(error) {
        console.log(error);
      });
      req.on('data', function(data) {
        console.log('our data is running');
        collectData += data;
      });
      req.on('end', function() {
        res.writeHead(201, headers);
        console.log('DATA IS ', collectData);
        res.end(JSON.stringify(responseBody));
      } );
      */
      //console.log('controller users post');
    }
  }
};

