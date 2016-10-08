var db = require('../db');
var Promise = require('bluebird');

module.exports = {
  messages: {
    get: function (cb) {
      return db.messages.get(function(rows) {
        cb(rows);
      });
    }, // a function which produces all the messages
    post: function (data) {
      return db.messages.post(data);
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (data) {
      db.users.post(data);

    }
  },

  friends: {
    // Ditto as above.
    get: function (id, cb) {
      return db.friends.get(id, function(rows) {
        cb(rows);
      });
    },
    post: function (data) {
      db.friends.post(data);

    }
  }
};

