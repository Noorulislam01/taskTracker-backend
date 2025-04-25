const { required } = require('joi');
const mongoose = require('mongoose');
const { type } = require('os');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  country:{
   type:String,
   required:true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
