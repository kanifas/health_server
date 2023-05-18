const { Schema, model } = require('mongoose');
const { String } = Schema.Types;

const SpecialitySchema = new Schema({
  name: { type: String, required: true },
});

module.exports = model('Speciality', SpecialitySchema)