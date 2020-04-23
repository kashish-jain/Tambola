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

  console.log(
    `newConnection: ${num_players}`,
    "id:",
    player_ids[num_players - 1]
  );

  // events emitted for new connection
  if (num_players == 1) {
    console.log("user connecte");
    socket.emit(`userConnected`, { type: "Host" });
  } else {
    socket.emit(`userConnected`, { type: "PC" });
  }

  // winning call made
  socket.on("callWinfromPC", (callWinType, houses) => {
    console.log(callWinType);
    console.log(houses);

    // call for host (just send to host)
    io.sockets.emit(`callWinforHost`, callWinType, houses);
  });

  // results from host
  socket.on("resultsFromHost", (hostCheck, callWinType) => {
    // NEED TO SEND TO EVERYONE BUT
    //    Need to know who called for win
    // call to PCs notifying someone won something
    console.log(hostCheck, "for", callWinType);
    socket.broadcast.emit(`resultsForPC`, hostCheck, callWinType);
  });

  // events for host calling number from front-end button click
  socket.on("newNumber", (num) => {
    // event for notifying PCs that new number was called
    socket.broadcast.emit(`newNumberFromHost`, { newNumber: num });
    console.log(`newNumber: ${num}`);
  });

  //events for chatting
  socket.on("messageFromClient", (msg) => {
    console.log("message", msg);
    socket.broadcast.emit("messageToClient", msg);
  });

  // deal with disconnects here later
  // CASES:
  //  - dealing with host's disconnection
  //  - dealing with PC's disconnection and joining back - use cookies I guess
  socket.on("disconnect", () => {
    player_ids.pop();
    console.log("userDisconnected");
  });
});

app.get("/", (req, res) => {
  res.send("go to /game/roomId");
  console.log("root");
});

// All files are served from build folder which gets generated
// when frontend code is built
app.use(express.static(path.join(__dirname + "/build")));

// This index.html is the game's main page and not web's landing page
app.get("/game/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

let port = process.env.PORT || 3000;
server.listen(port, (req, res) => {
  console.log("listening on port", port);
});
