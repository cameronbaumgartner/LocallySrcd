const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Make Mongoose use `findOneAndUpdate()` instead of the deprecated MongoDB method, useFindAndModify, which it would otherwise use under the hood. Note that this option is `true` by default; you need to set it to false.
mongoose.set('useFindAndModify', false);

// note: the schema below use a storeID of type string instead of a Schema.Types.ObjectID because these ids point to records received from the Yelp API rather than records saved in a Mongo collection of our own. These strings will be used to match up our Mongo records with items in an array of stores returned from the Yelp query.

const closedStoreSchema = new Schema({
  storeID: { type: String, required: true, unique: true },
});

const ClosedStore = mongoose.model('closedStore', closedStoreSchema);

const reviewSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    refs: 'user',
    required: true,
  },
  storeID: {        // non-unique
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
});

const Review = mongoose.model('review', reviewSchema);

/*
const ratingSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    refs: 'user',
    required: true,
  },
  storeID: {        // non-unique
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
});

const Rating = mongoose.model('rating', ratingSchema);
*/

module.exports = {
  ClosedStore,
  Review,
  // Rating
};