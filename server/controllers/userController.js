const bcrypt = require('bcrypt'); // 🧟‍♂️ 🧟‍♀️
const User = require('../models/userModel');

// create the user
const userController = {
  createUser(req, res, next) {
    const { username, password, prefLocations } = req.body;

    User.create(
      {
        username: username,
        password: password,
        prefLocations: prefLocations,
      },
      (err, newUser) => {
        if (err)
          return next({
            log: 'Error user already exists',
            message: err,
          });
        const { username, prefLocations } = newUser;
        res.locals.username = username;
        res.locals.prefLocations = prefLocations;
        console.log('res.locals.user -->', res.locals);
        return next();
      }
    );
  },

  // authenticate user by checking if they are in the database
  getUser(req, res, next) {
    console.log('in getUser', req.body);
    const { username, password } = req.body;

    User.findOne(
      {
        username: username,
      },
      (err, foundUser) => {
        if (err)
          return next({
            log: 'Error in user.find middleware',
            message: err,
          });

        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (err) {
            return 'error';
          }
          if (result) {
            res.locals.username = foundUser.username;
            res.locals.favorites = foundUser.favorites;
            return next();
          }
          return res.status(418).send('Permission denied');
        });
      }
    );
  },

  // execute if user wants to update their preferred locations in the database
  updateUser(req, res, next) {
    const { username, password, prefLocations } = req.body;
    User.findOneAndUpdate(
      {
        username: username,
        password: password,
        prefLocations: prefLocations,
      },
      {
        prefLocations: prefLocations,
      },
      { upsert: true, new: true },
      (err, userObj) => {
        if (err) return err;
        res.locals.updatedUser = userObj;
        return next();
      }
    );
  },

  getFavorites(req, res, next) {
    // temporary sample user, change
    const userID = '60074ab9707e6f29cecd1487';

    User.findOne({ _id: userID }, (err, user) => {
      if (err) return err;
      res.locals.favorites = user.prefLocations;
      return next();
    });
  },

  addFavorite(req, res, next) {
    return next();
  },

  removeFavorite(req, res, next) {
    return next();
  }
};

module.exports = userController;
