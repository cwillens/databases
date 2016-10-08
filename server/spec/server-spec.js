/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: 'mudd',
      database: 'chat'
    });
    dbConnection.connect();

    var tablename = 'messages'; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('truncate ' + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          message: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM messages';
        var queryArgs = [];

        setTimeout(function() {
          dbConnection.query(queryString, queryArgs, function(err, results) {
            // Should have one result:
            expect(results.length).to.equal(1);

            // TODO: If you don't have a column named message, change this test.
            expect(results[0].message).to.equal('In mercy\'s name, three days is all I need.');

            done();
          });

          
        }, 500);
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Valjean',
        message: 'Men like you can never change!',
        roomname: 'main'
      }
    }, function () {
      console.log('first callback');
      request(
        {
          method: 'GET',
          uri: 'http://127.0.0.1:3000/classes/messages',
        }, function(error, response, body) {
        console.log('err', error);
        console.log('hit message');
        console.log('results is ', response.results);
        console.log('body', body);
        var messageLog = JSON.parse(body);
        expect(messageLog[0].message).to.equal('Men like you can never change!');
        expect(messageLog[0].roomname).to.equal('main');
        done();
      });

    });


  });


  it('Should output all friendships from the DB', function(done) {
    // Let's insert a message into the db
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/friends',
      json: {
        userID: 1,
        friendID: 2
      }
    }, function () {
      console.log('first callback of friends');
      request(
        {
          method: 'GET',
          uri: 'http://127.0.0.1:3000/classes/friends?id=1',
        }, function(error, response, body) {
        console.log('err', error);
        console.log('hit message');
        console.log('results is ', response.results);
        console.log('body', body);
        var friendArray = JSON.parse(body);
        expect(friendArray[0].userID).to.equal(1);
        expect(friendArray[0].friendID).to.equal(2);


        done();
      });

    });


  });
});
