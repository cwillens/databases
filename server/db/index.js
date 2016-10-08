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
      Messages.sync()
      .then(function() {
        // Retrieve objects from the database:
        return Messages.findAll();
      })
      .then(function(messages) {
        messages.forEach(function(message) {
        });
        cb(messages);
      })
      .catch(function(err) {
        // Handle any error in the chain
        console.error(err);
        db.close();
      });

      
    }, // a function which produces all the messages
    post: function (data) {
      Messages.sync()
      .then(function() {
        // Now instantiate an object and save it:
        return Messages.create(data);
      })
      .then(function(message) {
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
      Users.sync()
      .then(function() {
        return Users.create(data);
      })
      .then(function(user) {
        if (!user) {
          return;
        }
        //db.close();
      })
      .catch(function(err) {
        // Handle any error in the chain
        console.error('error', err);
        db.close();
      });

    }
  }
};

