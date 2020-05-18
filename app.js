const path = require("path");
const http = require("http");
const express = require("express");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  wasHost,
  isThereAHost,
  hasGameStarted,
  startGame,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
var io = require("socket.io")(server, { pingTimeout: 240000 });

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
      if (hasGameStarted(user.room)) {
        socket.emit("gameHasAlreadyStarted");
      } else {
        socket.emit("userConnected", { type: "PC" });
      }

      // Let host know who joined
      io.to(user.room).emit("notifyHostConnection", user);
    }

    // if a room has more than one connections but no host, give out a message
    if (len > 1 && !isThereAHost(user.room)) {
      io.to(user.room).emit("HostDisconnected", user);
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
    if (user) {
      io.to(user.room).emit("callWinToHost", { callWinType, houses, user });
      console.log(callWinType, "from", user.username, "in room:", user.room);
    } else {
      console.log("ISSUE: win call coming from null user");
    }
  });

  // results from host
  socket.on("resultsFromHost", ({ result, callWinType, userCalledForWin }) => {
    let user = getCurrentUser(socket.id);

    if (user) {
      const room = user.room;

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
    } else {
      console.log("ISSUE: results coming from null host");
    }
  });

  // events for host calling number from front-end button click
  socket.on("newNumber", (num) => {
    const user = getCurrentUser(socket.id);

    // event for notifying PCs that new number was called
    if (user) {
      io.to(user.room).emit("newNumberFromHost", { newNumber: num });
      console.log("newNumberFromHost:", num, "in room:", user.room);
    } else {
      console.log("ISSUE: new number coming from null user");
    }
  });

  // receiver for Host Config done and emitter for Host Config done
  socket.on("HostConfigDone", (awards) => {
    const user = getCurrentUser(socket.id);

    if (user) {
      console.log("HostConfigDone:", user.username);
      startGame(user.room);
      io.to(user.room).emit("HostConfigDone", awards);
    } else {
      console.log("ISSUE: Host Config attempted with null user");
    }
  });

  // Know when a player is ready with number of tickets he is going to play with
  socket.on("PcReady", (numHouses) => {
    const user = getCurrentUser(socket.id);

    // Let host know that the player is ready
    if (user) {
      io.to(user.room).emit("PcReady", user, numHouses);
    } else {
      console.log("ISSUE: PcReady coming from null user");
    }
  });

  socket.on("PcsStatus", (user, PcsStatus) => {
    console.log("readyPlayers", PcsStatus);
    if (user) {
      io.to(user.room).emit("PcsStatus", PcsStatus);
    }
  });

  socket.on("hostCompletedChecking", () => {
    const user = getCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit("hostCompletedChecking");
    } else {
      console.log("ISSUE: hostCompletedChecking coming from null user");
    }
  });

  socket.on("showTimer", () => {
    const user = getCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit("showTimer");
    } else {
      console.log("ISSUE: showTimer coming from null user");
    }
  });

  // deal with disconnects here later
  // CASES:
  //  - dealing with host's disconnection
  //  - dealing with PC's disconnection and joining back - use cookies I guess
  socket.on("disconnect", (reason) => {
    let user = getCurrentUser(socket.id);

    if (user) {
      // Tell the host that a user got disconnected
      io.to(user.room).emit("userDisconnect", user);

      // tell everyone if the disconnected user was a host
      if (wasHost(user)) {
        io.to(user.room).emit("HostDisconnected", user);
      }
    }

    // logging
    user = userLeave(socket.id);
    console.log(
      "userDisconnected: ",
      user,
      "from room:",
      user ? user.room : null
    );
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
