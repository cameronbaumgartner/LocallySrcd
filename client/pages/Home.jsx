import React, { Component } from 'react';
import TopCategoriesContainer from '../containers/TopCategoriesContainer.jsx';
import SearchContainer from '../containers/SearchContainer.jsx';
import ResultsContainer from '../containers/ResultsContainer.jsx';
import { Map } from '../components/GoogleMap.jsx';


const Home = (props) => {

  const { results, favorites, closedLocations, closedStoreId, user, userID } = props.state;
  const { searchButtonHandler, catBtnHandler, reportClosed, favorited, unFavorited } = props;

  const location = {
    address: 'Codesmith Office, NYC',
    lat: 40.719200,
    lng: -74.005821,
  }

  return (
    <div className='homeContainer'>
      <p> Amplify your support. Shop locally! </p>
      <Map location={location} zoomLevel={17}/>
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