const bcrypt = require('bcrypt'); // 🧟‍♂️ 🧟‍♀️
const User = require('../models/userModel');

// create the user
const userController = {
  createUser(req, res, next) {
    const { username, password, favorites } = req.body;

    User.create(
      {
        username,
        favorites,
      },
      (err, newUser) => {
        if (err)
          return next({
            log: 'Error user already exists',
            message: err,
          });
        const { username, favorites } = newUser;
        res.locals.username = username;
        res.locals.favorites = favorites;
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
            console.warn('ERR at bcrypt.compare: ', err);
            return next(err);
          }
          if (result) {
            res.locals.username = foundUser.username;
            res.locals.favorites = foundUser.favorites;
            return next();
          }

          // else if result is null (?)
          console.log('Unsuccessful login attempt. Result of bycrpt.compare: ', result);
          return res.status(418).send('Permission denied');
        });
      }
    );
  },


  // query db for this user's array of favorite stores; store on res.locals
  getFavorites(req, res, next) {
    // temporary sample user, change
    const userID = '60074ab9707e6f29cecd1487';
    // const userID = req.cookies.userID;   //  TODO

    User.findOne({ _id: userID }, (err, user) => {
      if (err) {
        console.warn('ERR at getFavorites: ', err);
        return next(err);
      }

      res.locals.favorites = user.favorites;
      return next();
    });
  },

  // add the store faved on the frontend to the array of favorites
  addFavorites(req, res, next) {
    let { storeID } = req.body;  

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
    // temporary sample user, change
    const userID = '60074ab9707e6f29cecd1487';  // TODO: replace with req.cookies.userID
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
