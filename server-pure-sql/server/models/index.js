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
      console.log('running model messages post');
      return db.messages.post(data);
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (data) {
      console.log('running model users post with data', data);
      db.users.post(data);

    }
  }
};

