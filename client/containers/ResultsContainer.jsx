import React from 'react';
import ResultCard from '../components/ResultCard.jsx';
import { mapToMap } from '../components/GoogleMap.jsx';

const ResultsContainer = ({ results, favorites, closedLocations, reportClosed, closedStoreId, user, userID, favorited, unFavorited }) => {

  console.log('results :', results);
  console.log('favorites: ', favorites);
  console.log('closed Loc :', closedLocations);

  let recs = [];
  let forMap = [];

  if (!results) {
    recs = null;
  } else {
    results.forEach(
      (rec, i) => {
        const { id } = rec;
        forMap.push(rec.coordinates)

        // checking if store is one of the user's favs
        //favorites[id] ? isFav = true : isFav = false;
        recs.push(
          <ResultCard
            closedStoreId={closedStoreId}
            reportClosed={reportClosed}
            key={i}
            info={rec}
            storeID={id}
            user={user}
            userID={userID}
            favorites={favorites}
            favorited={favorited}
            unFavorited={unFavorited}
          />
        );
      }
      // }
    );
    mapToMap(forMap);
  }

  return (
    <div className="resultsContainer">
      {recs}
    </div>
  );
};

export default ResultsContainer;
