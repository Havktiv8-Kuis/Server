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
let question = JSON.parse(fs.readFileSync('./question.json'))

let questiondata = question
let userlistdata = userlist

io.on('connection', (socket) => {
    console.log('connecting');
    console.log(userlist)

    socket.on('check', (data) => {
        io.emit('check', userlistdata)
    })


    socket.on('user-join', (data) => {
        let userdata = userlist
        let user = userdata.find(el => el.username == data.username)
        if (!user) {
            userdata.push(data)
            fs.writeFileSync('userlist.json', JSON.stringify(userdata, null, 2))
            socket.emit("user-list", true);
            io.emit('user-join', userdata)
        } else {
            console.log("User already exist");
            socket.emit("user-list", false);
        }
    })
  
    socket.on('correct', (result) => {
        let newuserdata = []
        result.forEach(el => {
            let newdata = {
                username: el.username,
                score: el.score
            }
            newuserdata.push(newdata)
        })
        fs.writeFileSync('userlist.json', JSON.stringify(newuserdata, null, 2))
        io.emit('user-join', newuserdata)
        console.log(`${result.username} has answered.`);
    })


    socket.on('exit', (playername) => {
        console.log('data :' + playername);
        let newuserdata = []
        let data = userlist
        data.forEach(el => {
            if (el.username !== playername) {
                let newdata = {
                    username: el.username,
                    score: el.score
                }
                if (data.length > 1) {
                    newuserdata.push(newdata)
                }
            }
        })
        console.log(newuserdata)
        fs.writeFileSync('userlist.json', JSON.stringify(newuserdata, null, 2))
        io.emit('user-join', newuserdata)
    })

    socket.on('get-word', () => {
        let index = Math.floor(Math.random() * questiondata.length)
        io.emit("get-word", questiondata[index])
    })

});

http.listen(3000, () => {
    console.log('listening on :3000');
});