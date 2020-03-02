var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require ( 'socket.io' ) (http);
var conectados=0;
var siofu = require("socketio-file-upload");
app.use(siofu.router);
app.use(express.static(__dirname + '/public'));
// app.get('/', function(req, res){
//   res.sendFile (__dirname + '/index.html' );
// });
io.on('connection', function(socket){
  console.log('a user connected');
  conectados++
  socket.on('chat message', function(msg){
    console.log(msg);
  });
  var uploader = new siofu();
  uploader.dir = "./public/files";
  uploader.listen(socket);
  socket.on('escribiendo',function(msg){
    socket.broadcast.emit('escribiendo',msg);
  });
  socket.on('users',function(msg){
    console.log(msg);
    io.emit(msg);
  })
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    conectados--
    io.emit('conectados',conectados);
  });
  io.emit('conectados',conectados);
});
io.emit('some event', { 
  someProperty: 'some value',
  otherProperty: 'other value' 
}); 

http.listen(3000, function(){
  console.log('listening on *:3000');
});
