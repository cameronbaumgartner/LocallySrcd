const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// add cookie expiration??
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Session', sessionSchema);