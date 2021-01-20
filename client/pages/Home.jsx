import React, { Component } from 'react';
import TopCategoriesContainer from '../containers/TopCategoriesContainer.jsx';
import SearchContainer from '../containers/SearchContainer.jsx';
import ResultsContainer from '../containers/ResultsContainer.jsx';

const Home = (props) => {
  const { results, preferredLocations, closedLocations, closedStoreId, user, userID } = props.state;
  const { searchButtonHandler, catBtnHandler, reportClosed, favorited, unFavorited } = props;

  return (
    <div className='homeContainer'>
      <p> Practice kindness. Check in with one another. 
        <br></br>
        Amplify your support. Shop locally! </p>
      <SearchContainer searchButtonHandler={searchButtonHandler} />
      <TopCategoriesContainer catBtnHandler={catBtnHandler} />
      <ResultsContainer
        favorited={favorited}
        unFavorited={unFavorited}
        results={results}
        closedStoreId={closedStoreId}
        preferredLocations={preferredLocations}
        closedLocations={closedLocations}
        reportClosed={reportClosed}
        user={user}
        userID={userID}
      />
    </div>
  );
};

export default Home;

/* original Home Class Component
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render(){
    const { searchButtonHandler } = this.props;

    return(
      <div>
        <TopCategoriesContainer state={this.props} />
        <SearchContainer searchButtonHandler={searchButtonHandler} ></SearchContainer>
      </div>
  )}
}
*/
