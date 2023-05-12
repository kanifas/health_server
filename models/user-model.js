const { Schema, model } = require('mongoose');

const { String, Boolean } = Schema.Types;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isEmailConfirmed: { type: Boolean, default: false },
  signupConfirmLink: { type: String },
});

module.exports = model('User', UserSchema)