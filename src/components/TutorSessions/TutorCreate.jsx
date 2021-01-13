import React, { useState } from 'react';
import TutorCreateOptionItem from './TutorCreateOptionItem';
import UsernameSearchFeature from '../UsernameSearch/UsernameSearchFeature';

export default function TutorCreate(props) {

  // console.log('tutor create', props);

  function getUsernameList(props) {

    const usernameList = props.currentUserData;

    const currentUserID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);
    const filteredUsernameList = usernameList.filter(user => {
      return user.id !== currentUserID;
    });

    return filteredUsernameList.map(user => {
      return user.username;
    })
  }


  return (
    <div className='tutor-create-container'>
      <div className="tutor-create-header">
        Create Tutor Session
      </div>
      <div className="tutor-create-mentor-student">
        <div className="create-mentor-student-header">You're looking for:</div>
        <div className="radio-mentor">
          <input type="radio" name='radio-mentor-student' id='mentor' defaultChecked />
          <label htmlFor="mentor">Mentorship</label>
        </div>
        <div className="radio-student">
          <input type="radio" name='radio-mentor-student' id='student' />
          <label htmlFor="student">Menteeship</label>
        </div>
      </div>
      <div className="tutor-create-username">
        <UsernameSearchFeature
          usernameList={getUsernameList(props)}
        />
      </div>
      {props.createError && (
        <div className='tutor-create-error'>Please enter valid {props.createError}!</div>
      )}
      <div className="tutor-create-btn" onClick={() => props.createTutorSession()}>
        Create
      </div>
    </div>
  )

}