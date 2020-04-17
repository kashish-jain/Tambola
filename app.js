const path = require("path");
const http = require('http');
const express = require("express");

const app = express();
const server = http.createServer(app);
var io = require('socket.io').listen(server);

io.on("connection", (socket) => {
  console.log("new connection");
});

// All files are served from build folder which gets generated
// when frontend code is built
app.use(express.static(path.join(__dirname + "/build")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

server.listen(3000, (req, res) => {
  console.log("listening on port 3000");
});
