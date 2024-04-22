export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].nickname : users[0].nickname;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};