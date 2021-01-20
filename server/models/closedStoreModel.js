const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Make Mongoose use `findOneAndUpdate()` instead of the deprecated MongoDB method, useFindAndModify, which it would otherwise use under the hood. Note that this option is `true` by default; you need to set it to false.
mongoose.set('useFindAndModify', false);

const closedStoresSchema = new Schema({
  storeId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('ClosedStores', closedStoresSchema);