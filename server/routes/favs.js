const express = require('express');
const mainController = require('../controllers/mainController.js');
const userController = require('../controllers/userController.js');
const router = express.Router();

// want to just get favs
// todo: use cookies created at login instead of getUser
router.get('/favs', userController.getUser, (req, res) => {
  res.send('testing');
  res.status(200).json(res.locals.favorites);
});

module.exports = router;
