// storing users by id
const users = {};

// rooms: from roomID to number of connections
const rooms = {};

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users[id] = user;
  if(rooms[user.room]) {
    ++rooms[user.room];
  }
  else rooms[user.room] = 1;

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users[id];
}

// User leaves chat
function userLeave(id) {
  if(users[id]) {
    const user = users[id];
    
    // deleting from users
    delete users[id];

    // updating rooms
    if(rooms[user.room] == 1) {
      delete rooms[user.room];
    } else {
      --rooms[user.room];
    }

    return user;
  }
}

// Get number of room users
function getRoomUsers(room) {
  return rooms[room];
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
