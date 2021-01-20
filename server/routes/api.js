const express = require('express');
const mainController = require('../controllers/mainController.js');
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

router.get('/reviews',
  mainController.getReviews,
  (req, res) => res.status(200).json(res.locals.reviews)
);

router.post('/reviews',
  mainController.addReview,
  mainConrtoller.getReviews,
  (req, res) => res.status(200).json(res.locals.reviews)
);

router.get('/ratings',
  mainController.getRatings,
  (req, res) => res.status(200).json(res.locals.ratings)
);

router.post('/ratings',
  mainController.addRating,
  mainController.getRatings,
  (req, res) => res.status(200).json(res.locals.ratings)
);

module.exports = router;
