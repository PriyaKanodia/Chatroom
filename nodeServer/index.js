// Node server to handle socket io connections

const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});
const path = require("path")
const cors = require("cors")

const users = {};

app.use(cors())
app.use(express.static("css"));
app.use(express.static("js"));
app.use(express.static("images"));

io.on('connection', socket => {
    
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message=>{ 
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });
})

app.get('/',(req, res) => {
    const filePath = path.join(__dirname, "index.html");
    res.sendFile(filePath);
});

server.listen(3000);