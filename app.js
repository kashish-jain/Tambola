const path = require("path");
const http = require("http");
const express = require("express");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

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
    const len = getRoomUsers(user.room);
    if (len == 1) {
      socket.emit("userConnected", { type: "Host" });
    } else {
      socket.emit("userConnected", { type: "PC" });
    }

    // Welcome current user
    console.log(
      "Hi",
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
  socket.on("callWinFromPC", ({ callWinType, houses }) => {
    const user = getCurrentUser(socket.id);

    // call for host (just send to host)?
    // right now notifications are directly generated from this object on PC's screen
    io.to(user.room).emit("callWinToHost", { callWinType, houses, user });
    console.log(callWinType, "from", user.username, "in room:", user.room);
  });

  // results from host
  socket.on("resultsFromHost", ({ result, callWinType, userCalledForWin }) => {
    const room = getCurrentUser(socket.id).room;

    // call to PCs notifying someone won something
    let calledWinUsername = userCalledForWin.username;
    console.log(
      result,
      "on",
      calledWinUsername,
      "for",
      callWinType,
      "in room:",
      room
    );
    io.to(room).emit("resultsForPC", {
      result,
      callWinType,
      calledWinUsername,
    });
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
  socket.on("disconnect", (reason) => {
    const user = userLeave(socket.id);
    console.log("userDisconnected from room:", user ? user.room : null);
    console.log("reason:", reason);
  });
});

app.use(express.static(path.join(__dirname + "/landing")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/landing/index.html"));
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
