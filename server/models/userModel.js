const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Make Mongoose use `findOneAndUpdate()` instead of the deprecated MongoDB method, useFindAndModify, which it would otherwise use under the hood. Note that this option is `true` by default; you need to set it to false.
mongoose.set('useFindAndModify', false);

// require bcrypt and use it to encrypt the
const SALT_WORK_FACTOR = 5;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [ { type: String } ]    // array of ids that match ids of stores pulled from Yelp API

});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      return next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
