function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

var socket = io.connect('http://chat.multiverseminer.com:8080');
var user   = 'User'+randomInt(1,999);
// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
          // call the server-side function 'adduser' and send one parameter (value of prompt)
          
          socket.emit('adduser', user);
          });

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
          $('#conversation').append('\<b>'+username + ':\</b> ' + data + '\<br>').scrollTop($("#conversation").prop('scrollHeight'));
          });

// listener, whenever the server emits 'updaterooms', this updates the room the client is in
socket.on('updaterooms', function(rooms, current_room) {
          $('#rooms').empty();
          $.each(rooms, function(key, value) {
                 if(value == current_room){
                 $('#rooms').append('\<div>' + value + '\</div>');
                 }
                 else {
                 $('#rooms').append('\<div>\<a href="#" onclick="switchRoom(\''+value+'\')">' + value + '\</a>\</div>');
                 }
                 });
          });

function switchRoom(room){
    socket.emit('switchRoom', room);
}

// on load of page
$(function(){
  // when the client clicks SEND
  $('#datasend').click( function() {
                       var message = $('#data').val();
                       $('#data').val('');
                       // tell server to execute 'sendchat' and send along one parameter
                       socket.emit('sendchat', message);
                       });
  
  // when the client hits ENTER on their keyboard
  $('#data').keypress(function(e) {
                      if(e.which == 13) {
                      $(this).blur();
                      $('#datasend').focus().click();
                      }
                      });
  });
