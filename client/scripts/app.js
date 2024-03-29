// YOUR CODE HERE:

var msToTime = (s) => {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  if (hrs > 0) {
    return (hrs + ' hours ago');
  } else if (mins > 0) {
    return (mins + ' minutes ago');
  } else {
    return (secs + ' seconds ago');
  }
};


var stringClean = (string) => {
  if (string === undefined) {
    return 'notUndefined';
  }
  var newString = '';
  for (var i = 0; i < string.length; i++) {
    var char = string[i];
    if (char === '/') {
      newString += '&#x2F;';
    } else if (char === '&') {
      newString += '&amp;';
    } else if (char === '<') {
      newString += '&lt;';
    } else if (char === '>') {
      newString += '&gt;';
    } else if (char === '"') {
      newString += '&quot;';
    } else if (char === '\'') {
      newString += '&#x27;';
    } else {
      newString += char;
    }
  }
  return newString;
};



var wrapDiv = (text, className) => {
  var output = '<div';
  if (className) {
    output += ' class=' + className;
  }
  output += '>';
  output += text + '</div>';
  return output;
};

var cleanMessage = (messageObj) => {
  var keys2clean = ['message', 'username', 'roomname'];
  for (var i = 0; i < keys2clean.length; i ++) {
    messageObj[keys2clean[i]] = stringClean(messageObj[keys2clean[i]]);
  }
};



class ChatterBox {
  constructor() {
    this.currentRoom = 'Lobby';
    this.allRooms = new Set();
    this.addedRooms = new Set();
    this.addedMessages = {};
    //this.server = 'https://api.parse.com/1/classes/messages?order=-createdAt';
    this.server = 'http://127.0.0.1:3000';
    //this.server = 'https://chatreactorserver.herokuapp.com';
    this.messageServer = this.server + '/classes/messages';
    this.messagesByUser = {}; 
    this.friendSet = new Set();

  }

  init () {

    this.renderRoom(this.currentRoom);
    this.fetch();

    $('.submit').click((e) => {
      this.handleSubmit();
      //$('.submit').reset();
    });

    setInterval( () => {
      this.fetch();
    }, 5000);

    $('#roomSelect').on('change', (e) => {
      this.updateRoom();
    });

    $('.new-room').on('click', () => {
      var newRoom = prompt('Name your New Room');
      this.renderRoom(newRoom);
      $('#roomSelect').val(newRoom);
      this.currentRoom = newRoom;
      this.clearMessages();
      this.fetch();
    });
  }

  updateRoom () {
    this.currentRoom = $('#roomSelect').val();
    this.clearMessages();
    this.fetch();
  }

  filter (attribute, value) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.messageServer,
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        data = JSON.parse(data);
        if (!data) {
          return;
        }
        for (var i = 0; i < data.length; i++) {
          var ourResult = data[i];
          cleanMessage(ourResult);
          this.allRooms.add(ourResult.roomname);
          this.renderRoom(ourResult.roomname);
          var id = ourResult.id;
          if ( !(id in this.addedMessages)) {
            if (ourResult[attribute] === value) {
              this.renderMessage(ourResult);
            }
          } else {
            var recoveredMessage = this.addedMessages[id];
            this.updateTime(recoveredMessage);
          }
        }
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }

    });

  }


  fetch () {
    this.filter('roomname', this.currentRoom);
  }

  handleSubmit () {
    var messageObj = this.createMessage();
    if (messageObj.roomname) {
      this.send(messageObj);
      $('#message').val('');
    }
  }

  clearMessages () {
    $('#chats').empty();
    this.addedMessages = {};
    this.messagesByUser = {};
  }

  renderRoom (room) {
    if ( !this.addedRooms.has(room) && room.length > 0) {
      var optionString = `<option value="${room}">${room}</option>`;
      $('#roomSelect').append(optionString);
      this.addedRooms.add(room);

      var span = `<button class="sidebarRoom">${room}</button><br>`;
      $('.sidebar').append(span);

      var $lastRoom = $('.sidebarRoom').last();
      var ourContext = this;
      $lastRoom.on('click', function() {
        //debugger;
        //var ourRoom = $(this).val();
        ourContext.currentRoom = room;
        ourContext.clearMessages();
        ourContext.fetch();
      });
    }
  }

  updateTime (messageObj) {
    var currentTime = new Date();
    var time = msToTime(currentTime - new Date(messageObj.createdAt));
    messageObj.$time.text(time);
  }
  renderMessage (messageObj) {
    var id = messageObj.id;
    this.addedMessages[id] = messageObj;


    var currentTime = new Date();
    var time = msToTime(currentTime - new Date(messageObj.createdAt));


    var div1 = wrapDiv(messageObj.message, 'message');
    var div2 = wrapDiv(messageObj.username + ':', 'username');
    var div3 = wrapDiv(time, 'createdAt');


    var bigDiv = wrapDiv(div2 + div1 + div3, 'chat');
    var lastAdded;

    $('#chats').prepend(bigDiv);
    lastAdded = $('#chats .username').first();


    var $message = lastAdded.next('.message');

    var user = messageObj.username;
    if (this.friendSet.has(user)) {
      if ($message.text()) {
        $message.addClass('friend');
      }
    }
    this.messagesByUser[user] = this.messagesByUser[user] || [];
    this.messagesByUser[user].push($message);

    var $time = $message.next('.createdAt');
    messageObj.$time = $time;


    var ourContext = this;
    lastAdded.on('click', function () {
      var user = $(this).text().slice(0, -1);
      if (!ourContext.friendSet.has(user)) {
        ourContext.friendSet.add(user);
      } else {
        ourContext.friendSet.delete(user);
      }
      var arr = ourContext.messagesByUser[user];
      if (!arr || !arr.length) {
        return;
      }
      for (var i = 0; i < arr.length; i ++) {
        if (arr[i].text()) {
          arr[i].toggleClass('friend');
        }
      }
    });
  }


  createMessage () {
    var message = $('.create-message').val();
    var messageObj = {};
    messageObj.message = message;
    messageObj.roomname = this.currentRoom;
    messageObj.username = this.getUserName();
    return messageObj;
  }

  send (messageObj) {
    var messageJSON = JSON.stringify(messageObj);
    var ourContext = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.messageServer,
      type: 'POST',
      data: messageJSON,
      contentType: 'application/json',
      success: (data) => {
        messageObj.createdAt = data.createdAt;
        messageObj.id = data.id;
        //ourContext.renderMessage(messageObj);
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to createMessage message', data);
      }
    });
    this.fetch();
  }

  getUserName () {
    var userName = window.location.search.slice(10);
    return userName;
  }
}


var app = new ChatterBox();
$(document).ready( () => {
  app.init();
});
/*

$.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/messages',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to createMessage message', data);
  }
});

*/