const express = require('express');
const mainController = require('../controllers/mainController.js');
const sessionController = require('../controllers/sessionController.js');
const router = express.Router();

router.post('/report', mainController.reportClosed, (req, res) => {
  res.status(200).send({ closedStoreId: res.locals.closedStoreId });
});

router.post('/',
  mainController.getClosedStores,
  mainController.getResults,
  (req, res) => {
    console.log('back in api.js'),
      res.status(200).json({
        results: res.locals.results,
        term: res.locals.term,
        closedStoreList: res.locals.closedStoresList,
      });
  }
);

// if you inspect the response in Postman, it may look like the usernames were not added to the review objects. However, console-logging the property directly, e.g. res.locals.reviews[0].username, shows that it is in fact present on the object. 
router.get('/reviews',
  mainController.getReviews,
  (req, res) => res.status(200).json(res.locals.reviews)
);

router.post('/reviews',
  // sessionController.isLoggedIn,
  mainController.addReview,
  mainController.getReviews,
  (req, res) => res.status(200).json(res.locals.reviews)
);


module.exports = router;
