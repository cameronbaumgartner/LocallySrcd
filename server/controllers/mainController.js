const path = require('path');
const yelp = require('yelp-fusion');
const client = yelp.client(
  'C875dNRjWAzLaQgmC7nd_wO97JFWpg6PuDdI9mfVsru_cOTvyoouijdnEAQwW2rnVUJ5lELwswChXgQaOJpSNpLK4tK6Jr_Gi1xRtp3dWA2UZT7B7xYP5zDBmEYDYHYx'
);
const { ClosedStore, Review } = require('../models/storeModel.js');
const User = require('../models/userModel');

const mainController = {};
const userID = '60074ab9707e6f29cecd1487';  // TODO: replace with req.cookies.SSID
const user = { _id: userID, username: 'shelby'}; // TODO: replace with username queried from users collection

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
      // use reduce to take response object's array of businesses and reduce it down to 10 results, removing unneeded key-value pairs
      let counter = 0;

      // IDEA: Change reduce to a map, and grab just the first 10 (or 100) indices of the fetched array.
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
      // send back term,
      res.locals.term = term;
      return next();
    })
    .catch((e) => {
      console.log(e);
    });
};

// reviews and ratings
mainController.getReviews = (req, res, next) => {
  const { storeID } = req.query;
  console.log('Getting reviews for storeID ', storeID, typeof storeID);

  Review.find({ storeID }, (err, reviews) => {
    if(err) {
      console.warn('ERROR at getReviews: ', err);
      return next(err);
    }

    console.log('Reviews before iterating: ', reviews);
    
    // using promise.all to iterate synchronously through asynchronous queries on each review in the array
    function getUsernames() {
      const promises = [];
      for (let i = 0; i < reviews.length; i++) {
        console.log(reviews[i].userID);
        promises.push(
          User.findById(reviews[i].userID, (err, user) => {
            if (err) {
              console.warn('ERROR at getReviews forEach: ', err);
              return next(err);
            }
            // reviews[i].username = user.username;
            console.log('Found user: ', user);
          })
        );
      }
      return Promise.all(promises);
    }
    
    getUsernames().then(() => {
      console.log('Reviews after iterating: ', reviews);
      res.locals.reviews = reviews;
      return next();
    });

  });
}

mainController.addReview = (req, res, next) => {
  const { storeID } = req.query;
  const { text, rating } = req.body;
  console.log('Adding review to storeID ', storeID, ': ', text);

  Review.create({ user, storeID, text, rating }, (err, doc) => {
    if (err) {
      console.warn('ERROR at addReview: ', err);
      return next(err);
    }

    console.log('New review added to db: ', doc);
    return next();
  });
}

/*
mainController.getRatings = (req, res, next) => {
  const { storeID } = req.query;
  console.log('Getting ratings for storeID ', storeID);

  Rating.find({ storeID }, (err, ratings) => {
    if(err) {
      console.warn('ERROR at getRatings: ', err);
      return next(err);
    }

    console.log('Got ratings: ', ratings);
    res.locals.ratings = ratings;
    return next();
  });
}

mainController.addRating = (req, res, next) => {
  const { storeID } = req.query;
  const { rating } = req.body;
  console.log('Adding rating to storeID ', storeID, ': ', rating);

  Rating.create({ user, storeID, rating }, (err, doc) => {
    if (err) {
      console.warn('ERROR at addRating: ', err);
      return next(err);
    }

    console.log('New rating added to db: ', doc);
    return next();
  });
}
*/

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
