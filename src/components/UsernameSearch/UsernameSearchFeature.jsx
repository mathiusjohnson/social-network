import React from 'react';
import '../../styles/username-search.css';
import UsernameSearchItem from './UsernameSearchItem';
import { useState } from 'react';
import { useEffect } from 'react';

export default function UsernameSearchFeature(props) {

  const [searchResults, setSearchResults] = useState([]);

  const searchResultData = searchResults.map((result, index) => {
    return <UsernameSearchItem
      key={index}
      name={result}
      setUsernameValue={setUsernameValue}
    />
  })

  const usernameList = props.usernameList;

  function changeSearchState() {
    const userInput = typeof document !== 'undefined' && document.querySelector('#search-user-input').value
    // console.log(userInput);

    // user has to input set number of chars
    let currentSearchResults = [];
    if (userInput.length > 0) {
      for (let username of usernameList) {
        if (username.includes(userInput)) {
          currentSearchResults.push(username);
        }
      }
    }

    setSearchResults(currentSearchResults);
    console.log(currentSearchResults);
  }

  function setUsernameValue(username) {

    const searchInput = typeof document !== 'undefined' && document.querySelector('#search-user-input');
    searchInput.value = username;

    setSearchResults([]);
  }

  return (
    <div className='username-search-container'>
      <div className='username-search-input'>
        <label htmlFor="search-user" id='username-search-label'>Search: </label>
        <input
          type="text"
          id='search-user-input'
          placeholder='Enter username...'
          onChange={() => changeSearchState()} />
      </div>
      <div className="username-search-results" id='tutor-search-results'>
        {searchResultData}
      </div>
    </div>

  )
}