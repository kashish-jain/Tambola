// storing users by id
const users = {};

// rooms: from roomID to number of connections
const rooms = {};

// hosts: from roomID to hostID of that room
const hosts = {};

// startedGames: from roomID to hasGameStarted
const startedGames = {};

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users[id] = user;
  if (rooms[user.room]) {
    ++rooms[user.room];
  } else {
    rooms[user.room] = 1;
    hosts[user.room] = user.id;

    // host joins
    startedGames[user.room] = false;
  }

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users[id];
}

// User leaves chat
function userLeave(id) {
  if (users[id]) {
    const user = users[id];

    // deleting from users
    delete users[id];

    // updating rooms
    if (rooms[user.room] == 1) {
      // delete room from rooms and startedGames
      delete rooms[user.room];
      delete startedGames[user.room];
    } else {
      --rooms[user.room];
    }

    // updating hosts
    if (id === hosts[user.room]) {
      delete hosts[user.room];
    }

    return user;
  }
}

// Get number of room users
function getRoomUsers(room) {
  return rooms[room];
}

// function to check if this user is a host
function wasHost(user) {
  if (user.id == hosts[user.room]) {
    return true;
  }
  return false;
}

// function to check if there is a host in a given room
function isThereAHost(room) {
  if (hosts[room]) {
    return true;
  }
  return false;
}

function hasGameStarted(roomID) {
  if (startedGames[roomID]) {
    console.log("hasGameStarted function true roomID", roomID);
    return true;
  }
  console.log(
    "hasGameStarted function false roomID",
    roomID,
    `result ${startedGames[roomID]}`
  );
  return false;
}

function startGame(roomID) {
  if (startedGames[roomID] === false) {
    startedGames[roomID] = true;
  } else {
    console.log(
      "ERROR: Either starting an already started game or starting a game which does not exist"
    );
  }
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  wasHost,
  isThereAHost,
  hasGameStarted,
  startGame,
};
