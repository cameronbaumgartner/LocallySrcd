const path = require('path');
const yelp = require('yelp-fusion');
const client = yelp.client(
  'C875dNRjWAzLaQgmC7nd_wO97JFWpg6PuDdI9mfVsru_cOTvyoouijdnEAQwW2rnVUJ5lELwswChXgQaOJpSNpLK4tK6Jr_Gi1xRtp3dWA2UZT7B7xYP5zDBmEYDYHYx'
);
const { ClosedStore, Review } = require('../models/storeModel.js');
const User = require('../models/userModel');

const mainController = {};

// get stores by search term
mainController.getResults = (req, res, next) => {
  const { term, longitude, latitude } = req.body;

  client
    .search({
      term: term,
      latitude: latitude,
      longitude: longitude,
    })
    .then((response) => {
      let mappedResults = [];
      let index = 0;
      while (mappedResults.length < 10) {
        const biz = response.jsonBody.businesses[index];
        // if this business's id is not included on the object listing closed stores, push it to the results array
        if (!res.locals.closedStoresList[biz.id]) {
          mappedResults.push(biz);
        }
        index++;
      }
      // mutate the objects in the array to remove unneeded props
      mappedResults = mappedResults.map(biz => {
        delete biz.alias;
        delete biz.is_closed;
        delete biz.transactions;
        delete biz.price;

        return biz;
      });

      /*
      // use reduce to take response object's array of businesses and reduce it down to 10 results, removing unneeded key-value pairs
      let counter = 0;
      const reducedResults = response.jsonBody.businesses.reduce(
        (acc, cv, idx) => {
          // checking if the results arr of obj's id matches the closed store's arr of obj's id
          let storeIdVal = cv.id;
          if (res.locals.closedStoresList.hasOwnProperty(storeIdVal)) {
            counter++;
            return acc;
          }

          // delete irrelevant key val pairs from yelp's API response
          if (idx < 10 + counter) {
            delete cv.alias;
            delete cv.is_closed;
            delete cv.transactions;
            delete cv.price;
            acc.push(cv);
          }
          return acc;
        },
        []
      );
      res.locals.results = reducedResults;
      */

      res.locals.results = mappedResults;
      // send back term too
      res.locals.term = term;
      return next();
    })
    .catch((e) => {
      console.log(e);
    });
};

// helper function to synchronously query the database to find out the username associated with each review in the array returned from getReviews, then add that username as a proprety on the review
// using promise.all to iterate synchronously through asynchronous queries on each review in the array
mainController.getUsernames = (res, reviews) => {
  res.locals.reviews = [];
  const promises = [];
  for (let i = 0; i < reviews.length; i++) {
    const clone = Object.assign(reviews[i]);

    promises.push(
      User.findById(clone.userID, (err, user) => {
        if (err) {
          console.warn('ERROR at getReviews forEach: ', err);
          return next(err);
        }
        
        if (user) {
          // console.log('Found user: ', user.username);
          clone.username = user.username;
          res.locals.reviews.push(clone);
        } else {
          console.log(`User not found at id ${clone.userID}`);
        }

        // TODO: get the modified review objects to return out of getUsernames, NOT the found users.
      }).exec()
    );
  }
  return Promise.allSettled(promises);
};

// reviews and ratings
mainController.getReviews = (req, res, next) => {
  const { storeID } = req.query;
  console.log('Getting reviews for storeID ', storeID);

  Review.find({ storeID }, (err, reviews) => {
    if(err) {
      console.warn('ERROR at getReviews: ', err);
      return next(err);
    }
    
    mainController.getUsernames(res, reviews).then(() => {
      return next();
    });
  });
}

mainController.addReview = (req, res, next) => {
  const { storeID } = req.query;
  const { text, rating } = req.body;
  const userID = req.cookies.SSID;
  console.log('Adding review to storeID ', storeID, ': ', text);

  Review.create({ userID, storeID, text, rating }, (err, doc) => {
    if (err) {
      console.warn('ERROR at addReview: ', err);
      return next(err);
    }

    console.log('New review added to db: ', doc);
    return next();
  });
}

// closed stores
mainController.getClosedStores = (req, res, next) => {
  ClosedStore.find({}, (err, closedStores) => {
    if (err) return next(`Error in getClosedStores middleware: ${err}`);
    const closedStoreIdCache = {};
    // this is an arr of objs which has closed store id's
    for (let obj of closedStores) {
      let innerId = obj.storeId;
      //State updated:  {user: undefined, isLoggedIn: true, preferredLocations: undefined, closedLocations: undefined, fetchTerm: undefined, …} the actual id values are the keys, bools are the vals
      closedStoreIdCache[innerId] = true;
    }
    res.locals.closedStoresList = closedStoreIdCache;
    return next();
  });
};

mainController.reportClosed = (req, res, next) => {
  const { storeId } = req.body;

  ClosedStores.create(
    {
      storeId: storeId,
    },
    (err, newClosedStore) => {
      if (err)
        return next({
          log: 'Error: Store Is Already Marked As Closed',
          message: err,
        });
      const { storeId } = newClosedStore;
      res.locals.closedStoreId = storeId;
      return next();
    }
  );
};

module.exports = mainController;
