const Session = require('../models/sessionModel');

const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
  if (!req.cookies.ssid) {
    res.locals.isLoggedIn = false;
    // return next();
    return res.status(403).send('Access denied. You must be logged in to post a review.');
  }

  Session.findOne({ cookieId: req.cookies.ssid }, (err, session) => {
    if (err) return next(err);
    if (!session) return res.status(403).send('Access denied. You must be logged in to post a review.');
    
    res.locals.isLoggedIn = session !== null;
    return next();
  });
}

// sessionController.checkSession = (req, res, next) => {
//   if (!req.cookies.ssid) {
//     return res.status(403).send('Access denied. You must be logged in to post a review.');
//   }

//   Session.findOne({ cookieId: req.cookies.ssid }, (err, session) => {
//     if (err) return next(err);
//     if (!session) return res.status(403).send('Access denied. You must be logged in to post a review.');
    
//     return next();
//   });
// }

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
