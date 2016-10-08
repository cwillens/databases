var mysql = require('mysql');
var Promise = require('bluebird');
var Sequelize = require('sequelize');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".



var db = new Sequelize('chat', 'root', 'mudd');
/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var Users = db.define('Users', {
  username: Sequelize.STRING
});

var Messages = db.define('Messages', {
  username: Sequelize.STRING,
  message: Sequelize.STRING,
  roomname: Sequelize.STRING
});

module.exports = {
  Users: Users,
  Messages: Messages,
  db: db,

  messages: {
    get: function (cb) {
     /* var queryPromise = Promise.promisify(dbConnection.query);
      return queryPromise('SELECT * FROM messages')
      .then(function(rows) {
        console.log('rows', rows);
        return cb(rows);
      })
      .catch(function(err) { throw err; })
      .finish(function() {
        console.log('finished db get promise');
      });*/
      Messages.sync()
      .then(function() {
        // Retrieve objects from the database:
        return Messages.findAll();
      })
      .then(function(messages) {
        messages.forEach(function(message) {
          //console.log(message.message + ' exists');
        });
        cb(messages);
        //db.close();
      })
      .catch(function(err) {
        // Handle any error in the chain
        console.error(err);
        db.close();
      });

      
      // dbConnection.query('SELECT * FROM messages', function(err, rows) {
      //   if (err) { throw err; }
      //   console.log('rows', rows);
      //   cb(rows);
      // });
      
    }, // a function which produces all the messages
    post: function (data) {
      Messages.sync()
      .then(function() {
        // Now instantiate an object and save it:
        return Messages.create(data);
      })
      .then(function(message) {
        //console.log(message.message + ' exists');
        //db.close();
      })
      .catch(function(err) {
        // Handle any error in the chain
        console.error(err);
        db.close();
      });

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (data) {
      console.log('db user post ', data);
      Users.sync()
      .then(function() {
        console.log('first then is running', data);
        // Now instantiate an object and save it:
        return Users.create(data);
      })
      .then(function(user) {
        if (!user) {
          console.log('no user');
          return;
        }
        console.log(user.username + ' exists');

        //db.close();
      })
      .catch(function(err) {
        // Handle any error in the chain
        console.error('catch is running', err);
        db.close();
      });



      // console.log('running db users post with data', data);
      // dbConnection.query('INSERT INTO users SET ?', data, function(err, res) {
      //   if (err) { throw err; }
      //   console.log('success!');
      // });

    }
  }
};

