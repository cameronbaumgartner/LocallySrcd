const bcrypt = require('bcrypt'); 
const User = require('../models/userModel');

// create the user
const userController = {
  createUser(req, res, next) {
    const { username, password } = req.body;

    User.create({ username, password },
      (err, newUser) => {
        if (err) {
          return next({
            log: 'Error user already exists',
            message: err,
          });
        }
        res.locals.userID = newUser._id.toString();
        res.locals.username = newUser.username;
        res.locals.favorites = newUser.favorites;
        console.log('res.locals.user -->', res.locals);
        return next();
      },
    );
  },

  // authenticate user by checking if they are in the database
  getUser(req, res, next) {
    const { username, password } = req.body;
    console.log('Logging in user', username);

    User.findOne({ username },
      (err, foundUser) => {
        if (err) {
          return next({
            log: 'Error in user.find middleware',
            message: err,
          });
        }

        bcrypt.compare(password, foundUser.password, (error, result) => {
          if (error) {
            console.warn('ERR at bcrypt.compare: ', error);
            return next(err);
          }
          if (!result) {
            // if result is null
            console.log('Unsuccessful login attempt. Result of bycrpt.compare: ', result);
            return res.status(418).send('Permission denied');
          }

          res.locals.username = foundUser.username;
          res.locals.favorites = foundUser.favorites;
          res.locals.userID = foundUser._id.toString();
          return next();
        });
      }
    );
  },


  // query db for this user's array of favorite stores; store on res.locals
  getFavorites(req, res, next) {
    const userID = req.cookies.ssid;

    User.findOne({ _id: userID }, (err, user) => {
      if (err) {
        console.warn('ERR at getFavorites: ', err);
        return next(err);
      }

      try {
        res.locals.favorites = user.favorites;
      }
      catch (error) {
        console.warn('Error adding user #', userID, '\'s favorites to the response object: ', error);
      }
      return next();
    });
  },

  // add the store faved on the frontend to the array of favorites
  addFavorites(req, res, next) {
    const { storeID } = req.body;  

    try {
      res.locals.favorites.push(storeID);
    }
    catch(err) {
      console.warn('error pushing new storeID into array: ', err);
    }

    return next();
  },

  removeFavorite(req, res, next) {
    console.log('removeFavorite: ', req.body.storeID, ' from ', res.locals.favorites);

    try {
      res.locals.favorites.splice(res.locals.favorites.indexOf(req.body.storeID), 1);
    }
    catch (err) {
      console.warn('error removing storeID from array: ', err);
    }

    // console.log('after removing: ', res.locals.favorites);
    return next();
  },

  // update user record with the modified array
  updateFavorites(req, res, next) {
    const userID = req.cookies.ssid;
    const favorites = res.locals.favorites; 

    User.findOneAndUpdate(
      { _id: userID }, 
      { favorites }, 
      { upsert: true, new: true }, 
      (err, user) => {
        if (err) {
          console.log('ERR at updateFavorites: ', err); 
          return next(err);
        }

        res.locals.favorites = user.favorites;
        return next();
      }
    );
  }
};

module.exports = userController;
