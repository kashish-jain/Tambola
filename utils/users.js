// storing users by id
const users = {};

// rooms: from roomID to number of connections
const rooms = {};

// hosts: from roomID to hostID of that room
const hosts = {};

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users[id] = user;
  if (rooms[user.room]) {
    ++rooms[user.room];
  } else {
    rooms[user.room] = 1;
    hosts[user.room] = user.id;
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
      delete rooms[user.room];
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

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  wasHost,
  isThereAHost,
};
