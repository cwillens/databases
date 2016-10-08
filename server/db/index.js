var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var genInsert = function (tableName, data) {
  var text = 'INSERT INTO ' + tableName + ' VALUES ' + data.;
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
    get: function () {}, // a function which produces all the messages
    post: function () {
      console.log('running model messages post');
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (data) {
      console.log('running db users post with data', data);
      dbConnection.query('INSERT INTO employees SET ?', employee, function(err,res){
        if(err) throw err;

        console.log('Last insert ID:', res.insertId);
      });

    }
  }
};

