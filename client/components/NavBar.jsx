import React, { Component, useState } from 'react';
import { Link } from "react-router-dom";

const NavBar = ( {logInSubmitHandler, userStatus, userName, favorites, logoutHandler, signUpPop, signUpButtonHandler, createUser, favResults, closedLocations, favListHandler} ) => {
      // if user is logged in, we should render a new nav bar welcoming back the user.  logInSubmitHandler={logInSubmitHandler} 
      console.log('signup?', signUpPop)
  // check if user is logged in and if they have pressed to sign up

  const [noLogInput, setNoLogInput] = useState('');
  const [userDrop, setUserDrop] = useState(false);

  const pressEnterLogin = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitLogin();
    }
  }

  const submitLogin = () => {
    const username = document.getElementById('userName').value;
    const password = document.getElementById('passWord').value; 
    if (!password || !username) {
      setNoLogInput('Please enter username and password!');
    } else {
      setNoLogInput('');
      logInSubmitHandler(username, password);
    }
  }

  const pressEnterSignUp = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSignUp();
    }
  }

  const submitSignUp = () => {
    const username = document.getElementById('userName').value;
    const password = document.getElementById('passWord').value; 
    if (!password || !username) {
      setNoLogInput('Please enter username and password!');
    } else {
      setNoLogInput('');
      createUser(username, password);
    }
  }

  let FavIcon = <img src="../assets/fullheart.png"></img>;
  let recs = []; 
  if (!favResults) {
    recs = null;
  } else {
    favResults.forEach(
      (rec, i) => {
        // if (id !== closedStoreId) {
        // check if the location is open & user is using account
        //if (!closedLocations[id] && favorites){
        let isFav = false;
        if (favorites.includes(id)) isFav = true;
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
          } = rec;
          // concatenating the address to display
          let restAddress = location.display_address.join(', ');
        
          const displayCategories = categories
            .map((obj) => {
              delete obj.alias;
              return obj.title;
            })
            .join(' ');
        
          const handleFavorite = () => {
            if (isFav) unFavorited(storeID);
            favorited(storeID);
          }
          //convert meters into miles -> this is the distance from place to user
          const distFromUser = metersToMiles(distance);
        
          // render the correct full rating stars
          const displayStars = fullStars(rating);
          // if half star rating:
          if (rating % 1 !== 0) {
            displayStars.push(<img src="../assets/halfstar.png"></img>);
          }

        recs.push(
          <div className="favResultCardContainer">
            <div id="favCardContainer">
              <img className="favPlacePic" src={image_url}></img>
              <div className="favPlaceCard">
              <div id="favCardHeader">
                <a href={url} target="_blank">
                  {' '}
                  {name}
                </a>
                <div id="innerflex">
                  <img src="../assets/thickpin.png"></img>
                  <span id="distance">{distFromUser} miles</span>
                </div>
              </div>
              <article>
                <span id="categories">{displayCategories}</span>
                <span id="address">{restAddress}</span>
                <span id="phone">{display_phone}</span>
              </article>
            </div>
            </div>
            <div id="finalRow">
              <div id="totalrating">
                <div className="stars">{displayStars}</div>
                <span id="reviewCount"> {review_count}</span>
              </div>
              <button id='reportClosed' value={id} type='button' onClick={(event) => reportClosed(event, reportClosed)}>Report Closed</button>
              <div id="favIcon" onClick={() => handleFavorite()}>{FavIcon}</div>
            </div>
          </div>
        );
      }
    );
  }

   if (!userStatus && !signUpPop) {
    return (
      <div>
        <div className="login">
          <form>
            <input className="loginput" id ="userName" type="text"
              placeholder="username"
              onKeyPress={(e) => pressEnterLogin(e) } 
            /> 
            <input className="loginput" id="passWord" type="password"
              placeholder="password"
              onKeyPress={(e) => pressEnterLogin(e) }
            /> 
            <button id="logbutton" type="button"
            onClick={() => submitLogin() }
            >
              Log In
          </button>
          <button id="signup" type="button" onClick={() => {setNoLogInput(''); signUpButtonHandler()} }>Sign Up</button>
          </form>
        </div>
        <div id="noLogInput">{noLogInput}</div>
      </div>
    )
    // if user has pressed sign up button, we return sign up form 
  } else if (signUpPop) {
    return (
      <div className="signupform">Please sign up
        <form>
          <div>
          <input className="signupinput" id ="userName" type="text"
          placeholder="username"
          onKeyPress={(e) => pressEnterSignUp(e) } 
          />
          </div>
          <div>
          <input className="signupinput" id="passWord" type="password"
            placeholder="password"
            onKeyPress={(e) => pressEnterSignUp(e) } 
          /> 
          </div>
          </form>
          <div id="noSignInput">{noLogInput}</div>
          <div>
            {/* say hello to our little panda 🐼 */}
          <button id="signupformbtn" type="button" onClick={() => {
            submitSignUp()
          } }>Sign Up</button>
          </div>
          <div>
          <button id="signuplogbtn" type="button"
            onClick={() => {setNoLogInput(''); signUpButtonHandler()} }
            >
              Log In
          </button>
          </div>
      </div>
    )
    // otherwise we return a welcome home message
  } else {
    if (userDrop) {
      return (
        <div className="loggedin">
          Welcome home, <span id="userName" onClick={() => setUserDrop(userDrop ? false : true)}>{userName}▼</span>
          <button id="logbutton" type="button" onClick={() => logoutHandler()
          }>Log Out</button>
          <div id="userDropContainer">
            {/*need to call favListHandler() to update favResults and reload favorites list here*/}
            Favorites:
            <div id="userFavorites">
              {recs}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="loggedin">
          Welcome home, <span id="userName" onClick={() => { favListHandler(); setUserDrop(userDrop ? false : true) }}>{userName}▼</span>
          <button id="logbutton" type="button" onClick={() => logoutHandler()
          }>Log Out</button>
        </div>
      )
    }
  }
};
  
  export default NavBar;
