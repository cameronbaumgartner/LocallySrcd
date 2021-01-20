const bcrypt = require('bcrypt'); // 🧟‍♂️ 🧟‍♀️
const User = require('../models/userModel');

// create the user
const userController = {
  createUser(req, res, next) {
    const { username, password, favorites } = req.body;

    User.create(
      {
        username: username,
        favorites: favorites,
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
            console.log('ERR at bcrypt.compare: ', err);
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

  // execute if user wants to update their favorites in the database
  /*
  updateUser(req, res, next) {
    const { username, password, favorites } = req.body;
    User.findOneAndUpdate(
      {
        username: username,
        password: password,
        favorites: favorites,
      },
      {
        favorites: favorites,
      },
      { upsert: true, new: true },
      (err, userObj) => {
        if (err) return next(err);
        res.locals.updatedUser = userObj;
        return next(err);
      }
    );
  },
  */

  // query db for this user's array of favorite stores; store on res.locals
  getFavorites(req, res, next) {
    // temporary sample user, change
    const userID = '60074ab9707e6f29cecd1487';
    // const userID = req.cookies.userID;   //  TODO

    User.findOne({ _id: userID }, (err, user) => {
      if (err) {
        console.log('ERR at getFavorites: ', err);
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
      console.log('error pushing new storeID into array: ', err);
    }

    return next();
  },

  removeFavorite(req, res, next) {
    console.log('removeFavorite: ', req.body.storeID, ' from ', res.locals.favorites);
    /*
    const copy = res.locals.favorites.slice();
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] === req.body.storeID) {
        copy.splice(i, 1);
        break;
      }
    }
    
    res.locals.favorites = copy;
    */

    res.locals.favorites.splice(res.locals.favorites.indexOf(req.body.storeID), 1);
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
          console.log('ERR at addFavorite: ', err); 
          return next(err);
        }

        res.locals.favorites = user.favorites;
        return next();
      }
    );
  }
};

module.exports = userController;
