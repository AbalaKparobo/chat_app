const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
let count = 0;
io.on('connection', socket => {
    let user = "User" + count++;
    console.log(user + " has connected");
    io.emit("chat message", user + " has connected")
    socket.on("chat message", msg => {
        io.emit("chat message",  msg);
    })

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })

})

server.listen(process.env.PORT || 3000, err => {
    console.log("App is running!");
});