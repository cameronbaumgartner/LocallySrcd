import React, { Component,useEffect,useState } from 'react';

const metersToMiles = (meters) => {
  return Math.round((meters / 1609.344) * 10) / 10;
};

const fullStars = (rating) => {
  const total = [];
  let fullCount = Math.floor(rating);
  while (fullCount > 0) {
    total.push(<img src="../assets/fullstar.png"></img>);
    fullCount--;
  }
  return total;
};

const ResultCard = ({ info, favorites, reportClosed, closedStoreId, storeID, favorited, unFavorited }) => {
  let FavIcon;

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
  const [reviewText, setReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [fetched, setFetched] = useState(false);


  const displayCategories = categories
    .map((obj) => {
      delete obj.alias;
      return obj.title;
    })
    .join(' ');


  const displayForm = (reviewDisplay) => {
    return reviewDisplay ? 
      <form className="newReviewForm" onSubmit={(event) => {
        submitReview(reviewText, newRating);
        event.preventDefault();
      }}>
        <select className="rating-dropdown" 
                defaultValue={5} 
                onChange={(event) => setNewRating(event.target.value)} 
                required>
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>
        <textarea value={reviewText} 
                  placeholder="Say something nice..." 
                  onChange={(event) => setReviewText(event.target.value)} required></textarea>
        <input type="submit"></input>
      </form> :
      '';
  }

  const displayReviews = (reviewDisplay) => {
    const reviewHTML = reviews.map((review, index) => {
      return (
        <div className="review" key={`Store${storeID}Review${review._id || index}`}>
          <div className="reviewDetails">
            <p>{review.username || 'anonymous'}</p>
            <p>Rating: {review.rating}/5</p>
          </div>
          <div className="reviewBody">
            <p>{review.text}</p>
          </div>
        </div>
      );
    });

    return reviewDisplay ? reviewHTML : '';
  }

  // form submission handler
  const submitReview = (text, rating) => {
    if (!text || !rating) return;
    console.log('Submitting', rating, '-star review for store ', storeID, ': ', text);

    const endpoint = '/api/reviews/?storeID=' + storeID;

    fetch(endpoint,
     {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        text,
        rating
      })
    }).then((res) => res.json())
    .then((data) => { 
      setReviewText('');
      setNewRating(1);
      setFetched(true);
    }).catch(err => console.warn('ERROR at submitReview POST: ', err));
  };

  const handleFavorite = () => {
    // console.log(storeID);
    if (favorites.includes(storeID)) unFavorited(storeID);
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

  if (favorites.includes(storeID)) {
      FavIcon = <img src="../assets/fullheart.png"></img>;
    } else {
      FavIcon = <img src="../assets/emptyheart.png"></img>;
  }

  useEffect(() => {
    // send get request to database when Reviews label is clicked to get reviews array
    fetch(`/api/reviews/?storeID=${storeID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/JSON',
      },
    })
    .then((data) => data.json())
    .then((data) => {
      for(let i = 0; i < data.length; i += 1) {
        // console.log('reviewbody:', data[i].text);
        setReviews(data);
      }
    })
    .catch((err) => console.log(err));

  }, [reviewDisplay, fetched])


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
              <div id="favIcon" onClick={() => handleFavorite()}>{FavIcon}
            </div>
          </article>
        </div>
        <div className="reviewContainer">
          <span className="reviewLabel" onClick={() => {setReviewDisplay(reviewDisplay ? false : true)}}>Do you recommend this business? ▼</span>
          { displayForm(reviewDisplay) }
          { displayReviews(reviewDisplay) }
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
          </article>
        </div>
        <div>
          {reviews}
        </div>
      </div>
    )}
};

export default ResultCard;
