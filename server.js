var PORT  = process.env.PORT  || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + "/public"));

io.on('connection', function(socket){
   console.log("user connected to socket.io");

   socket.on('message' , function(message){
      console.log('message received ' + message.text);
      io.emit('message' , message); //everyone. socket.broadcast everyone except you
   });
   socket.emit('message', {
      text: 'Welcome to chat application!'
   })
});

http.listen(PORT, function(){
   console.log('Server started');
});
