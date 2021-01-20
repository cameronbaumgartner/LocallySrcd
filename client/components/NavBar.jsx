import React, { Component, useState } from 'react';
import { Link } from "react-router-dom";

const NavBar = ( {logInSubmitHandler, userStatus, userName, logoutHandler, signUpPop, signUpButtonHandler, createUser} ) => {
      // if user is logged in, we should render a new nav bar welcoming back the user.  logInSubmitHandler={logInSubmitHandler} 
      console.log('signup?', signUpPop)
  // check if user is logged in and if they have pressed to sign up

  const [noLogInput, setNoLogInput] = useState('');

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
          <button id="signup" type="button" onClick={() => signUpButtonHandler()}>Sign Up</button>
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
            onClick={() => signUpButtonHandler() }
            >
              Log In
          </button>
          </div>
      </div>
    )
    // otherwise we return a welcome home message
  } else {
    return (
      <div className="loggedin">
        Welcome home, {userName}
        <button id="logbutton" type="button" onClick={() => logoutHandler()
        }>Log Out</button>
      </div>
       
    )
  }
};
  
  export default NavBar;