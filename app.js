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

      // Let host know who joined
      io.to(user.room).emit("notifyHostConnection", user);
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

  // receiver for Host Config done and emitter for Host Config done
  socket.on("HostConfigDone", (awards) => {
    const user = getCurrentUser(socket.id);

    console.log("HostConfigDone");
    io.to(user.room).emit("HostConfigDone", awards);
  });

  // Know when a player is ready with number of tickets he is going to play with
  socket.on("PcReady", (numHouses) => {
    const user = getCurrentUser(socket.id);

    // Let host know that the player is ready
    io.to(user.room).emit("PcReady", user, numHouses);
  });

  socket.on("PcsStatus", (user, PcsStatus) => {
    console.log("readyPlayers", PcsStatus);
    io.to(user.room).emit("PcsStatus", PcsStatus);
  });

  // deal with disconnects here later
  // CASES:
  //  - dealing with host's disconnection
  //  - dealing with PC's disconnection and joining back - use cookies I guess
  socket.on("disconnect", (reason) => {
    let user = getCurrentUser(socket.id);
    //Tell the host that a user got disconnected
    if (user) {
      io.to(user.room).emit("userDisconnect", user);
    }
    user = userLeave(socket.id);
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
