const { Schema, model } = require('mongoose');
const { roles } = require('../constants');
const { OccupationSchema } = require('./occupation-model');

const { String, Boolean, Number, ObjectId, Array } = Schema.Types;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  
  password: { type: String, required: true },
  
  role: { type: Number, required: true , default: roles.USER },
  
  name: { type: String, required: true },
  
  phone: { type: String, required: true },
  
  photo: { type: String },
  
  occupation: {
    type: [{type : ObjectId, ref: 'Occupation'}],
    default: []
  },
  /*
    User
      .find()
      .populate('occupation')
      .exec(...)
  */

  location: { type: String },
  
  isEmailConfirmed: { type: Boolean, default: false },
  
  signupConfirmLink: { type: String },
  
  workDayFrom: { type: String, default: '10:00' },

  workDayTo: { type: String, default: '18:00' },

  slotSize: { type: Number, default: 30 },

  allowChangeAnotherCalendar: { type: Boolean, default: false },
});

module.exports = model('User', UserSchema);
