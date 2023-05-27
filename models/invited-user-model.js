const { Schema, model } = require('mongoose');
const { roles } = require('../constants');
const { String, Boolean, Number, ObjectId } = Schema.Types;

const InvitedUserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  
  role: { type: Number, default: roles.USER },
  
  name: { type: String, required: true },
  
  phone: { type: String, required: true },
  
  occupation: { type: String },

  location: { type: String },
  
  isEmailConfirmed: { type: Boolean, default: false },
  
  signupConfirmLink: { type: String },
  
  allowChangeAnotherCalendar: { type: Boolean, default: false },
});

module.exports = model('InvitedUser', InvitedUserSchema);
