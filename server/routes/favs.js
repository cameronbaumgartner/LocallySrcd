const express = require('express');
const mainController = require('../controllers/mainController.js');
const userController = require('../controllers/userController.js');
const router = express.Router();

// want to just get favs
<<<<<<< HEAD
// todo: use cookies created at login instead of getUser
router.get('/favs', userController.getUser, (req, res) => {
  res.send('testing');
  res.status(200).json(res.locals.favorites);
});
=======
// TODO: getFavs controller
// router.get('/favs', userController.getUser, (req, res) => {
//   res.status(200).json(res.locals.user);
// });
>>>>>>> cf0b2b1ef8db73660b4830c80a5aece6b29005a2

module.exports = router;
