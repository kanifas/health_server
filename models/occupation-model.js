const { Schema, model } = require('mongoose');
const { String } = Schema.Types;

const OccupationSchema = new Schema({
  name: { type: String, required: true },
});

module.exports = model('Occupation', OccupationSchema)