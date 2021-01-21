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

  // submission form should be first element in reviews array
  let tempReviews = [];
  tempReviews.push();

  const displayCategories = categories
    .map((obj) => {
      delete obj.alias;
      return obj.title;
    })
    .join(' ');

  // TODO: clickable star buttons
  // const starBtns = [];
  // let i = 1;
  // while (i <= 5) {
  //   <button key={`${i} Stars @ ${storeID}`} value={i} onClick={(event) => {
  //     setNewRating(event.target.value);
  //   }}>
  //     <img src="../assets/fullstar.png"></img>
  //   </button>
  // }

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

  // form submission handler
  const submitReview = (text, rating) => {
    if (!text || !rating) return;
    console.log('Submitting', rating, '-star review for store ', storeID, ': ', text);
    const endpoint = '/api/reviews/?storeID=' + storeID;
    console.log('endpoint', endpoint);
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
    // if (isFav) {
    //   FavIcon = <img src="../assets/fullheart.png"></img>;
    // } else {
    //   FavIcon = <img src="../assets/emptyheart.png"></img>;
    // }
  // favIcon
  // let FavIcon = <img src="../assets/emptyheart.png"></img>;;
  if (favorites.includes(storeID)) {
      FavIcon = <img src="../assets/fullheart.png"></img>;
    } else {
      FavIcon = <img src="../assets/emptyheart.png"></img>;
  }
  useEffect(() => {
    // send get request to database when Reviews label is clicked to get reviews array
    if (reviewDisplay) {
      fetch(`/api/reviews/?storeID=${storeID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'Application/JSON',
        },
      })
      .then((data) => data.json())
      .then((data) => {
        for(let i = 0; i < data.length; i += 1) {
          tempReviews.push(
            <div className="review" key={`Store${storeID}Review${i}`}>
              <div className="reviewDetails">
                <p>{data[i].username}</p>
                <p>Rating: {data[i].rating}/5</p>
              </div>
              <div className="reviewBody">
                <p>{data[i].text}</p>
              </div>
            </div>
          );
        }
      })
      .catch((err) => console.log(err));
    // if (reviewDisplay) {
    //   tempReviews.push(
    //     <div className="review" key="1">
    //       <div className="reviewDetails">
    //         <p>Sam P</p>
    //         <p>Rating: 5/5</p>
    //       </div>
    //       <div className="reviewBody">
    //         <p>100% would again</p>
    //       </div>
    //     </div>
    //   );
    //   tempReviews.push(
    //     <div className="review" key="2">
    //       <div className="reviewDetails">
    //         <p>Cam B</p>
    //         <p>Rating: 5/5</p>
    //       </div>
    //       <div className="reviewBody">
    //         <p>Meh</p>
    //       </div>
    //     </div>
    //   );
    //   setReviews(tempReviews);
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
            {/* <div id="favIcon" onClick={() => {
                isFav ? <img src="../assets/fullheart.png"></img> :
                        <img src="../assets/emptyheart.png"></img>; handleFavorite()}}>
            </div> */}
                        <div id="favIcon" onClick={() => handleFavorite()}>{FavIcon}
            </div>
          </article>
        </div>
        <div className="reviewContainer">
          <span className="reviewLabel" onClick={() => {setReviewDisplay(reviewDisplay ? false : true)}}>Do you recommend this business? ▼</span>
          { displayForm(reviewDisplay) }
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
            {/* <div id="favIcon" onClick={() => {
                isFav ? <img src="../assets/fullheart.png"></img> :
                        <img src="../assets/emptyheart.png"></img>; handleFavorite()}}>
            </div> */}
          </article>
        </div>
        <div>
          {reviews}
        </div>
      </div>
    )}
};

export default ResultCard;
