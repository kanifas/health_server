const { Schema, model } = require('mongoose');

const { String, ObjectId } = Schema.Types;

// TODO: добавить фингерпринт (ip юзера + его клиент (+ гео?))
const TokenSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

module.exports = model('Token', TokenSchema)