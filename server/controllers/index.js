var models = require('../models');
var fs = require('fs');
var Promise = require('bluebird');

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
      console.log(req.url);
      res.writeHead(200, headers);

    },
    get: function (req, res) {
      console.log(req.url);
      res.writeHead(200, headers);

      //var getPromise = Promise.promisify(models.messages.get);

      models.messages.get(function(rows) {
        console.log('rows is ', rows);
        //var responseBody = {headers: headers, method: req.method, url: req.url, results: rows };

        res.end(JSON.stringify(rows));       
      });
      /*
      .then(function(rows) {
        console.log('rows', rows);
        var responseBody = {headers: headers, method: req.method, url: req.url, results: rows };
        console.log('responseBody', responseBody);
        res.end(JSON.stringify(responseBody));
      })
      .catch(function(error) {
        console.log('there is an error!');
      })
      .finally(function() {
        console.log('finished the get promise!');
      });*/


    }, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log('running controller messages post');
      var collectData = '';
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
      console.log('our post is running');
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

