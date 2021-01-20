const Session = require('../models/sessionModel');

const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
  if (!req.cookies.ssid) {
    res.locals.isLoggedIn = false;
    return next();
  }

  Session.findOne({ cookieId: req.cookies.ssid }, (err, session) => {
    if (err) return next(err);
    res.locals.isLoggedIn = session !== null;
    return next();
  });
}

sessionController.startSession = (req, res, next) => {
  const cookieObj = { cookieId: res.locals.userID };

  Session.findOneAndUpdate(cookieObj, { $setOnInsert: cookieObj }, { upsert: true }, (err) => {
    if (err) return next(err);
    return next();
  });
}

sessionController.endSession = (req, res, next) => {
  if (!req.cookies.ssid) return next();

  Session.deleteOne({ cookieId: req.cookies.ssid }, (err) => {
    if (err) return next(err);
    return next();
  });
}

module.exports = sessionController;
