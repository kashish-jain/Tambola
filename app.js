const path = require("path");
const http = require("http");
const express = require("express");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
var io = require("socket.io").listen(server);

io.on("connection", (socket) => {

  // joining a room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    
    // joining the user in the room
    socket.join(user.room);
    
    // events emitted for new connection
    const len = getRoomUsers(user.room).length;
    if (len == 1) {
      socket.emit("userConnected", { type: "Host" });
    } else {
      socket.emit("userConnected", { type: "PC" });
    }

    // Welcome current user
    console.log("Hi",
      user.username,
      "id:",
      user.id,
      "Room id:",
      user.room,
      "Connection number:",
      len
    );
  });

  // winning call made
  socket.on("callWinfromPC", (callWinType, houses) => {
    const user = getCurrentUser(socket.id);

    // call for host (just send to host)?
    io.to(user.room).emit("callWinforHost", callWinType, houses);

    console.log(callWinType, "from", user.id, "in room:", user.room);
  });

  // results from host
  socket.on("resultsFromHost", (hostCheck, callWinType) => {
    const user = getCurrentUser(socket.id);

    // NEED TO SEND TO EVERYONE BUT
    //    Need to know who called for win
    // call to PCs notifying someone won something
    console.log(hostCheck, "for", callWinType, "in room:", user.room);
    io.to(user.room).emit("resultsForPC", hostCheck, callWinType);
  });

  // events for host calling number from front-end button click
  socket.on("newNumber", (num) => {
    const user = getCurrentUser(socket.id);

    // event for notifying PCs that new number was called
    io.to(user.room).emit("newNumberFromHost", { newNumber: num });
    console.log("newNumberFromHost:", num, "in room:", user.room);
  });


  // deal with disconnects here later
  // CASES:
  //  - dealing with host's disconnection
  //  - dealing with PC's disconnection and joining back - use cookies I guess
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log("userDisconnected from room:", user.room);
  });
});

// All files are served from build folder which gets generated
// when frontend code is built
app.use(express.static(path.join(__dirname + "/build")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

let port = process.env.PORT || 3000;
server.listen(port, (req, res) => {
  console.log("listening on port", port);
});
