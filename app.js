const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));


let userlist = []
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("disconnect", () =>
  {
    console.log('a user disconnected');
  });

  socket.on('user-join', (data) => {
    userlist.push(data)
    console.log('new user connected');
    io.emit('user-join', userlist)
  })

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});