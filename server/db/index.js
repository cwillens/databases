var mysql = require('mysql');
var Promise = require('bluebird');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var genInsert = function (tableName, data) {
  var text = 'INSERT INTO ' + tableName + ' (';

  text += Object.keys(data).join(', ') + ') VALUES (';
  //text += Object.values(data).join(', ') + ');';
  var valueArr = [];
  for (var key in data) {
    valueArr.push('"' + data[key] + '"');
  }
  text += valueArr.join(', ') + ');';
  return text;
};

var dbConnection;
module.exports = {
  connect: function() {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: 'mudd',
      database: 'chat'
    });
    dbConnection.connect();
  },
  messages: {
    get: function () {
      var queryPromise = Promise.promisify(dbConnection.query);
      return queryPromise('SELECT * FROM messages').then(function(rows) {
        console.log('rows', rows);
        return rows;
      }).catch(function(err) { throw err; });
      /*
      dbConnection.query('SELECT * FROM messages', function(err, rows) {
        if (err) { throw err; }
        console.log('rows', rows);
        return rows;
      });
      */
    }, // a function which produces all the messages
    post: function (data) {
      console.log('running model messages post');
      dbConnection.query('INSERT INTO messages SET ?', data, function(err, res) {
        if (err) { throw err; }
        console.log('success!');
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (data) {
      console.log('running db users post with data', data);
      dbConnection.query('INSERT INTO users SET ?', data, function(err, res) {
        if (err) { throw err; }
        console.log('success!');
      });

    }
  }
};

