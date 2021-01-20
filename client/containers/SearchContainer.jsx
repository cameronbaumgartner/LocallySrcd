import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const SearchContainer = ({ searchButtonHandler }) => {
  //console.log('search container: ', searchButtonHandler)

  const searchEnterHandler = (e) => {
    if (e.key === 'Enter') {
    searchInputHandler();
    }
  }

  const searchInputHandler = () => {
    let userKeywordInput = document.getElementById('searchInput').value;
    if (userKeywordInput) {
      userKeywordInput = '';
      searchButtonHandler(userKeywordInput);
    }
  }

  return (
    <div className="searchContainer">
      <input
        id="searchInput"
        type="text"
        placeholder="enter keyword here"
        onKeyPress={(e) => searchEnterHandler(e)}
      ></input>
      <button
        id="searchButton"
        type="button"
        onClick={() => searchInputHandler()}
      ></button>
    </div>
  );
};

export default SearchContainer;
