import React, { Component,useEffect,useState } from 'react';

const metersToMiles = (meters) => {
  return Math.round((meters / 1609.344) * 10) / 10;
};

const fullStars = (rating) => {
  const total = [];
  let count = Math.floor(rating);
  while (count > 0) {
    total.push(<img src="../assets/fullstar.png"></img>);
    count--;
  }
  return total;
};

const ResultCard = ({ info, favorites, reportClosed, closedStoreId, storeID, favorited, unFavorited }) => {
  const isFav = favorites.includes(storeID);
  console.log('result card: ', info);
  console.log('I AM A FAV: ', isFav);

  const {
    display_phone,
    image_url,
    name,
    rating,
    review_count,
    url,
    categories,
    location,
    distance,
    id,
  } = info;
  // concatenating the address to display
  let restAddress = location.display_address.join(', ');
  const [reviewDisplay, setReviewDisplay] = useState(false);
  const [reviews, setReviews] = useState([]);
  let tempReviews = [];

  const displayCategories = categories
    .map((obj) => {
      delete obj.alias;
      return obj.title;
    })
    .join(' ');

  const handleFavorite = () => {
    console.log(storeID);
    if (isFav) unFavorited(storeID);
    else favorited(storeID);
    // isFav = !isFav;
  }
  //convert meters into miles -> this is the distance from place to user
  const distFromUser = metersToMiles(distance);

  // render the correct full rating stars
  const displayStars = fullStars(rating);
  // if half star rating:
  if (rating % 1 !== 0) {
    displayStars.push(<img src="../assets/halfstar.png"></img>);
  }

  // favIcon
  let FavIcon;
  if (isFav) {
    FavIcon = <img src="../assets/fullheart.png"></img>;
  } else {
    FavIcon = <img src="../assets/emptyheart.png"></img>;
  }

  useEffect(() => {
    if (reviewDisplay) {
      // fetch(`/api/reviews/?storeID=${storeID}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'Application/JSON',
      //   },
      // })
      // .then((data) => data.json())
      // .then((data) => {
      //   for(let i = 0; i < data.length; i += 1) {
      //     tempReviews.push(
      //       <div className="review" key={storeID,i}>
      //         <div className="reviewDetails">
      //           <p>{data[i].username}</p>
      //           <p>Rating: {data[i].rating}</p>
      //         </div>
      //         <div className="reviewBody">
      //           <p>{data[i].text}</p>
      //         </div>
      //       </div>
      //     );
      //   }
      // })
      // .catch((err) => console.log(err));
      tempReviews.push(
        <div className="review" key="1">
          <div className="reviewDetails">
            <p>Sam P</p>
            <p>Rating: 5/5</p>
          </div>
          <div className="reviewBody">
            <p>100% would again</p>
          </div>
        </div>
      );
      tempReviews.push(
        <div className="review" key="1">
          <div className="reviewDetails">
            <p>Cam B</p>
            <p>Rating: 5/5</p>
          </div>
          <div className="reviewBody">
            <p>100% would again</p>
          </div>
        </div>
      );
      setReviews(tempReviews);
    } else {
      setReviews([]);
    }
  }, [reviewDisplay])
  // check if the current store id is equal to the closed store id in state
  if (id !== closedStoreId) {
    return (
      <div className="resultCardContainer">
        <div>
          <img className="placePic" src={image_url}></img>
        </div>
        <div className="placeCard">
          <div id="cardHeader">
            <a href={url} target="_blank">
              {' '}
              {name}
            </a>
            <div id="innerflex">
              <img src="../assets/thickpin.png"></img>
              <span>{distFromUser} miles</span>
            </div>
          </div>
          <article>
            <span id="categories">{displayCategories}</span>
            <span id="address">{restAddress}</span>
            <span id="phone">{display_phone}</span>
            <div id="totalrating">
              <div className="stars">{displayStars}</div>
              <span id="reviewCount"> {review_count}</span>
            </div>
            <button id='reportClosed' value={id} type='button' onClick={(event) => reportClosed(event, reportClosed)}>Report Closed</button>
            {/* add favorite click listener here */}
            <div id="favIcon" onClick={() => {console.log('favorited'); handleFavorite()}}>{FavIcon}</div>
          </article>
        </div>
        <div id="reviewContainer">
          <span onClick={() => {setReviewDisplay(reviewDisplay ? false : true)}}>Reviews ▼</span>
          {reviews}
        </div>
      </div>
    )
    // if the current result card is closed, we return below
  } else {
    return (
      <div className="resultCardContainer">
        <div>
          <img className="placePic" src={image_url}></img>
        </div>
        <div className="placeCard">
          <div id="cardHeader">
            <a href={url} target="_blank">
              {' '}
              {name}
            </a>
            <div id="innerflex">
              <img src="../assets/thickpin.png"></img>
              <span>{distFromUser} miles</span>
            </div>
          </div>
          <article>
            <span id="categories">{displayCategories}</span>
            <span id="address">{restAddress}</span>
            <span id="phone">{display_phone}</span>
            <div id="totalrating">
              <div className="stars">{displayStars}</div>
              <span id="reviewCount"> {review_count}</span>
            </div>
           {/* we should consider addidng a another event listener to toggle back to open if status changes */}
             <button id="isclosed">CLOSED</button>
            <div id="favIcon" onClick={() => handleFavorite()}>{FavIcon}</div>
          </article>
        </div>
        <div>
          {reviews}
        </div>
      </div>
    )}
};

export default ResultCard;
