const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.isLoggedIn, sessionController.endSession, (req, res) => {
  return res.sendStatus(200);
});

module.exports = router;
