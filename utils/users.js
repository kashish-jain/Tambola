// storing users by id
const users = {};

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users[id] = user;

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
    delete users[id];
    return user;
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
