const path = require("path");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
var io = require("socket.io").listen(server);

var player_ids = [];
var num_players = 0;

io.on("connection", (socket) => {
  // logic for Host and PC connection
  player_ids.push(socket.id);
  num_players = player_ids.length;

  console.log(`newConnection: ${num_players}`, "id:", player_ids[num_players - 1]);

  // events emitted for new connection
  if (num_players == 1) {
    socket.emit(`userConnected`, { type: "Host" });
  } else {
    socket.emit(`userConnected`, { type: "PC" });
  }

  // winning call made
  socket.on('callWinfromPC', (callWinType, houses) => {
    console.log(callWinType);
    console.log(houses);

    // call for host (just send to host)
    io.sockets.emit(`callWinforHost`, callWinType, houses);
  });

  // events for host calling number from front-end button click
  socket.on("newNumber", (num) => {
    
    // event for notifying PCs that new number was called
    socket.broadcast.emit(`newNumberFromHost`, { newNumber: num });
    console.log(`newNumber: ${num}`);
  });

  // deal with disconnects here later
  // CASES:
  //  - dealing with host's disconnection
  //  - dealing with PC's disconnection and joining back - use cookies I guess
  socket.on('disconnect', () => {
    player_ids.pop();
    console.log('userDisconnected');
  });
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
