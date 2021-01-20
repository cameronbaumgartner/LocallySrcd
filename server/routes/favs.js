const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();

// want to just get favs
// todo: use cookies created at login instead of getUser
router.get('/', userController.getFavorites, (req, res) => {
  res.status(200).json(res.locals.favorites);
});

router.post('/', 
  userController.getFavorites,
  userController.addFavorites,
  userController.updateFavorites, 
  (req, res) => {
    res.json(res.locals.favorites);
  }
);

router.delete('/',
  userController.getFavorites,
  userController.removeFavorite, 
  userController.updateFavorites,
  (req, res) => {
    res.json(res.locals.favorites);
  }
);

module.exports = router;
