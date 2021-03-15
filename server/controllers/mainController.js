const yelp = require('yelp-fusion');
const {YELP_KEY} = require('../secrets.js');
const client = yelp.client(YELP_KEY);
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
      const {businesses} = response.jsonBody;

      while (mappedResults.length < 10 && index < businesses.length) {
        try {
          // if this business's id is not included on the object listing closed stores, push it to the results array
          const biz = businesses[index];
          console.log('biz', biz);
          if (!res.locals.closedStoresList[biz.id]) {
            //remove unneeded props
            delete biz.alias;
            delete biz.is_closed;
            delete biz.transactions;
            delete biz.price;
            mappedResults.push(biz);
          }
        }
        catch(error) {
          console.log('ERROR pushing business into array:', biz, error);
        }
        
        index++;
      }

      res.locals.results = mappedResults;
      // send back term too
      res.locals.term = term;
      return next();
    })
    .catch((e) => {
      console.log('ERROR at getResults:', e);
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
      User.findById(clone.userID, (err, user, next) => {
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
  return Promise.all(promises);
};

// reviews and ratings
mainController.getReviews = (req, res, next) => {
  const { storeID } = req.query;
    Review.find({ storeID }, (err, reviews) => {
    if (err) {
      console.warn('ERROR at getReviews: ', err);
      return next(err);
    }

    console.log('Reviews for storeID ', storeID, reviews);

    if (!reviews.length) return next();
    mainController.getUsernames(res, reviews).then(() => {
      return next();
    });
  });
}

mainController.addReview = (req, res, next) => {
  const { storeID } = req.query;
  const { text, rating } = req.body;
  const userID = req.cookies.ssid || '60074aa51868f461b0b91e1d';
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
