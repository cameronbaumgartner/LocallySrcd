const express = require('express');
const mainController = require('../controllers/mainController.js');
const router = express.Router();

router.post('/report', mainController.reportClosed, (req, res) => {
  res.status(200).send({ closedStoreId: res.locals.closedStoreId });
});

router.post(
  '/',
  mainController.getClosedStores,
  mainController.getResults,
  (req, res) => {
    console.log('back in api.js'),
      res.status(200).send({
        results: res.locals.results,
        term: res.locals.term,
        closedStoreList: res.locals.closedStoresList,
      });
  }
);

module.exports = router;
