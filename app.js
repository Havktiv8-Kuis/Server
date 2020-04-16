const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require("cors");
const fs = require('fs')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


let userlist = JSON.parse(fs.readFileSync('./userlist.json'))
let userdata = userlist
io.on('connection', (socket) => {
    console.log('connecting');
    console.log(userlist)
    socket.on('user-join', (data) => {
        userdata.push(data)
        console.log(data.username);
        fs.writeFileSync('userlist.json', JSON.stringify(userdata, null, 2))
        io.emit('user-join', userdata)
    })
    socket.on("disconnect", () => {
        console.log('a user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on :3000');
});