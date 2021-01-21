import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import './stylesheet/styles.scss';

// Routers here
import Home from './pages/Home.jsx';

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: 'user', // will be reassigned after client signs up/logins
      isLoggedIn: false,
      favorites: [], // favorites: object with keys as the placeIDs and values of true; -> will be created when client receive user info after user logins
      closedLocations: null, // closed locations: object with keys as the placeIDs and values of true; -> will be created when client receives results back from fetch request
      fetchTerm: '',
      signUpPop: false,
      closedStoreId: null,
      longitude: 40.700655, // default; will be supplied from db after component mounts
      latitude: -73.94772689999999 // default
      // results: an array of objects // will be created when server sends back retrieved list of results - this should be update whenever keyword or category is submitted by user
    };

    this.updateUserCoordinates = this.updateUserCoordinates.bind(this);
    this.searchButtonHandler = this.searchButtonHandler.bind(this);
    this.categoryButtonHandler = this.categoryButtonHandler.bind(this);
    this.logInSubmitHandler = this.logInSubmitHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.signUpButtonHandler = this.signUpButtonHandler.bind(this);
    this.createUser = this.createUser.bind(this);
    this.reportClosed = this.reportClosed.bind(this);
    this.favorited = this.favorited.bind(this);
    this.unFavorited = this.unFavorited.bind(this);
    this.favListHandler = this.favListHandler.bind(this);
  }

  updateUserCoordinates(latitude, longitude) {
    // updates the state with the user's current location
    const userLat = latitude || 40.700655;    // default values in case lat or long is null (due to browser settings)
    const userLong = longitude || -73.94772689999999;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.latitude = userLat;
      newState.longitude = userLong;
      return newState;
    });
  }

  // event handler for when a category button is pressed
  categoryButtonHandler(event) {
    event.preventDefault();
    const term = event.target.value;
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        term: term,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log('data back from category ', data)
        this.setState((prevState) => { 
          const newState = { ...prevState };
          newState.results = data.results;
          newState.closedLocations = data.closedLocations;
          newState.fetchTerm = data.term;
          return newState;
        });
      })
      .catch((err) => console.log('ERROR at categoryButtonHandler POST:', err));
  }

  // get list of favorited businesses to display is user dropdown
  favListHandler() {
    // send list of storeID's to get favorites?
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        term: 'restaurants',
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        this.setState((prevState) => {
          const newState = { ...prevState };
          newState.favResults = data.results;
          newState.closedLocations = data.closedLocations;
          return newState;
        });
      })
      .catch((err) => console.log('ERROR at favListHandler POST:', err));
  }

  // send captured search term to Yelp api for search results
  searchButtonHandler(term) {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        term: term,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        this.setState((prevState) => {
          const newState = { ...prevState };
          newState.results = data.results;
          newState.closedStoreList = data.closedStoreList;
          newState.fetchTerm = data.term;
          return newState;
        });
      })
      .catch((err) => console.log('ERROR at searchButtonHandler POST:', err));
      const search = document.getElementById('searchInput');
      search.value = '';
  }

  // event handler for when user hits log in button
  logInSubmitHandler(username, password) {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(response => {
        if (response.ok) return response;
        
        if (response.status === 403) {
          alert('Incorrect username or password.');
        }
        throw Error(response.statusText);
      })
      .then((data) => data.json())
      .then((data) => {
        this.setState((prevState) => {
          const newState = { ...prevState };
          newState.username = data.username
          newState.isLoggedIn = true;
          newState.favorites = data.favorites;
          return newState;
        }, this.updateFavorites()); // call updateFavorites to update favorites list upon successful login
      })
      .catch((err) => console.log('ERROR at logInSubmitHandler POST:', err));
  }
  
  // event handler when log out button is clicked
  logoutHandler() {
    fetch('/logout', 
      { method: 'POST' }
    ).then((data) => console.log('Result of logoutHandler POST:', data))
    .catch((err) => console.log('ERROR at logoutHandler POST:', err));

    this.setState((prevState) => {
      const newState = { ...prevState }
      newState.username = 'user';
      newState.favorites = [];
      newState.isLoggedIn = false;
      newState.results = null;
      return newState;
    });
  }
 
  // displays signup menu
  signUpButtonHandler() {
    this.setState((prevState) => {
      const newState = { ...prevState };
      if (newState.signUpPop) newState.signUpPop = false;
      else newState.signUpPop = true;
      return newState;
    });
  }
  
  // event handler to when user clicks sign up button
  createUser(username, password) {
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    .then(response => {
      if (response.ok) return response;
      
      if (response.status === 409) {
        alert('Username already exists. Please try again');
      }
      throw Error(response.statusText);
    })
    .then((data) => {
      console.log(data);
      return data.json()
    })
    .then((data) => {
      console.log(data);
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.username = data.username
        newState.isLoggedIn = true;
        newState.signUpPop = false;
        newState.favorites = data.favorites;
        return newState;
      });
    })
    .catch((err) => console.log('ERROR at createUser POST:', err));
  }

  // event handler for user to report location closed
  reportClosed(event) {
    event.preventDefault();
    const closed = event.target.value;
    fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        storeId: closed,
        term: this.state.term,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log('data back from category ', data)
        this.setState((prevState) => {
          const newState = { ...prevState };
          newState.closedStoreId = data.closedStoreId;
          return newState;
        });
      })
      .catch((err) => console.log('ERROR at reportClosed POST:', err));
  }

  // event handler used to favorite a business
  favorited(storeID) {
    fetch('/favs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        storeID: storeID
      }),
    })
    .then((data) => data.json())
    .then((data) => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.favorites = data;
        return newState;
      });
    })
    .catch((err) => console.log('ERROR at favorited POST:', err));
  }

  // event handler used to remove a favorite business
  unFavorited(storeID) {
    fetch('/favs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        storeID: storeID
      }),
    })
    .then((data) => data.json())
    .then((data) => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.favorites = data;
        return newState;
      });
    })
    .catch((err) => console.log('ERROR at unFavorited DELETE:', err));
  }

  // update current user's favorites list
  updateFavorites() {
    fetch('/favs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/JSON',
      },
    })
    .then((data) => data.json())
    .then((data) => {
      this.setState((prevState) => {
        const newState = { ...prevState };
        newState.favorites = data;
        return newState;
      });
    })
    .catch((err) => console.log('ERROR at updateFavorites GET:', err));
  }

  componentDidMount() {
    // grab the user's location using browser's location and updates state -> client needs to give permission to access location
    const successfulLookup = (position) => {
      const { latitude, longitude } = position.coords;
      this.updateUserCoordinates(latitude, longitude);
    };

    navigator.geolocation.getCurrentPosition(successfulLookup, console.log);
  }

  componentDidUpdate() {
    // console.log('State updated: ', this.state);
  }

  render() {
    // appHeader -> is fixed stagnant/constant throughout entire UX. NavBar component will change depending on App's state
    return (
      <Router>
        <div className="appHeader">
          <Link to="/"> 
            <img
              id="logo"
              src="./assets/locallysrcdlogo.png"
              alt="Locally SRCD Logo"
              height='150px'
              width='150px'
            ></img>
          </Link>
          <NavBar 
            userName={this.state.username} 
            signUpPop={this.state.signUpPop}
            userStatus={this.state.isLoggedIn}
            favorites={this.state.favorites}
            favResults={this.state.favResults}
            closedLocations={this.state.closedLocations}
            logInSubmitHandler={this.logInSubmitHandler} 
            logoutHandler={this.logoutHandler} 
            signUpButtonHandler={this.signUpButtonHandler}
            createUser={this.createUser}
            favListHandler= {this.favListHandler}
            />
        </div>

        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Home  // contains GoogleMap and search results
                state={this.state}
                catBtnHandler={this.categoryButtonHandler}
                searchButtonHandler={this.searchButtonHandler}
                reportClosed={this.reportClosed}
                favorited={this.favorited}
                unFavorited={this.unFavorited}
              />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;












/*      original React Router Approach      
<Router>
    <div className='appHeader'>
      <Link to='/'><img id='logo' src='./assets/locallysrcdlogo.png' alt='Locally SRCD Logo'></img></Link>
      <NavBar />
    </div>

    <Switch>
      <Route path='/signup' component={SignUp} />
      <Route path='/favorites' component={Favorites} />
      <Route path='/results' render={() => (
        <Results 
          state={this.state} 
          searchButtonHandler={this.searchButtonHandler} 
          catBtnHandler={this.categoryButtonHandler}
        />)} />
      <Route path='/' exact render={() => (
        <Home 
          state={this.state} 
          catBtnHandler={this.categoryButtonHandler}  
        />)} />

    </Switch>
</Router>
*/
