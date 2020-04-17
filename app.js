const express = require("express");
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log("new connection");
  });

// All files are served from build folder which gets generated 
// when frontend code is built
app.use(express.static("build"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/build/index.html");
})

app.listen(3000, (req, res) => {
    console.log("listening on port 3000");
})