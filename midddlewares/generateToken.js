const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


const generateAuthToken = (user) => {
  const payload = { userId: user._id.toString() };  // .toString() is optional but safe
  return jwt.sign(payload, process.env.JWT_SECRET);
};

  module.exports =generateAuthToken;



  