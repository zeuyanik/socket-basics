var PORT  = process.env.PORT  || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var mongodb = require('mongodb');

var url = "mongodb://root:1@ds035026.mlab.com:35026/heroku_9zl9s7pf";
var clientInfo = {};

app.use(express.static(__dirname + "/public"));

function sendCurrentUsers (socket){
  var info  =clientInfo[socket.id];
  var users = [];
  if(typeof info  === "undefined"){
    return;
  }

  Object.keys(clientInfo).forEach(function(socketId){
    var userInfo = clientInfo[socketId];
    if(info.room  === userInfo.room){
      users.push(userInfo.name);
    }
  });

  socket.emit("message",{
    name:"System",
    text: "Current users: " + users.join(", "),
    timestamp: moment.valueOf()
  })


};

io.on('connection', function(socket){
   console.log("user connected to socket.io");

   socket.on('disconnect', function(){
     var userData = clientInfo[socket.id];
     if(typeof userData !== undefined){
       socket.leave(userData.room);
       io.to(userData.room).emit('message',{
         name: 'System',
         text: userData.name + " has left",
         timestamp : moment.valueOf()
       });
       delete clientInfo[socket.id];
     }
   })
   socket.on('joinRoom', function(req){
     clientInfo[socket.id] = req;

     socket.join(req.room);
     socket.broadcast.to(req.room).emit("message", {
       name: "system",
       text: req.name + " has joined!",
       timestamp : moment.valueOf()
     })
   });
   socket.on('message' , function(message){
      console.log('message received ' + message.text);

      if(message.text == "@currentUsers"){
        sendCurrentUsers(socket);
      }else{
        message.timestamp = moment().valueOf();
        var uri = 'mongodb://root:1@ds035026.mlab.com:35026/heroku_9zl9s7pf';

        mongodb.MongoClient.connect(uri, function(err, db) {
          if(err) throw err;
          else{
            console.log(db);
            db.collection(clientInfo[socket.id].room).insert({ message: message, user: clientInfo[socket.id].name, timestamp: moment.valueOf()}, {upsert: true});
          }
        });

        io.to(clientInfo[socket.id].room).emit('message' , message); //everyone. socket.broadcast everyone except you
      }

   });
   socket.emit('message', {
      name: "admin",
      text: 'All rights reserved by Zeynep',
      timestamp : moment.valueOf()
   })
});

http.listen(PORT, function(){
   console.log('Server started');
});
