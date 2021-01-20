import React, { Component } from 'react';
import TopCategoriesContainer from '../containers/TopCategoriesContainer.jsx';
import SearchContainer from '../containers/SearchContainer.jsx';
import ResultsContainer from '../containers/ResultsContainer.jsx';
import MapContainer from '../containers/MapContainer.jsx';


const Home = (props) => {

  const { results, favorites, closedLocations, closedStoreId, user, userID } = props.state;
  const { searchButtonHandler, catBtnHandler, reportClosed, favorited, unFavorited } = props;

  return (
    <div className='homeContainer'>
      <p> Practice kindness. Check in with one another. 
        <br></br>
        Amplify your support. Shop locally! </p>
      <MapContainer/>
      <TopCategoriesContainer catBtnHandler={catBtnHandler} />
      <SearchContainer searchButtonHandler={searchButtonHandler} />
      <TopCategoriesContainer catBtnHandler={catBtnHandler} />
      <ResultsContainer
        favorited={favorited}
        unFavorited={unFavorited}
        results={results}
        closedStoreId={closedStoreId}
        favorites={favorites}
        closedLocations={closedLocations}
        reportClosed={reportClosed}
        user={user}
        userID={userID}
      />
    </div>
  );
};

export default Home;