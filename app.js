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
  socket.emit("user-list", userlist);

  socket.on("disconnect", () =>
  {
    console.log('a user disconnected');
  });

  socket.on('user-join', (data) => {
    let user = userlist.find(el => el.name == data.name)
    if(!user)
    {
      userlist.push(data)
      console.log(userlist)
      console.log('new user connected');   
      socket.emit("user-list", true);     
      io.emit('user-join', userlist)
    }
    else
    {
      console.log("User already exist");
      socket.emit("user-list", false);
    }
  })

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});