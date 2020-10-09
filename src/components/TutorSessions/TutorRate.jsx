import React, { useState } from 'react';
import ReactStars from "react-star-rating-component";
import { formatDate, getMentorUsername, getStudentUsername, getDateStatus, getTimeAgo } from '../../helpers/tutor-helpers';

export default function TutorRate(props) {

  const [rating, setRating] = useState(0);

  // console.log('tutorrateprops', props);

  const onStarClick = (nextValue) => setRating(nextValue);
  const onStarHover = (nextValue) => setRating(nextValue);

  function getIsMentor(props) {
    const userID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);
    const sessionID = props.currentTutorID;

    for (let tutorSession of props.currentTutorData) {
      if (sessionID === tutorSession.id) {
        if (userID === tutorSession.mentor_id) {
          return true;
        }
        return false;
      }
    }

  }

  function getTutorComments() {
    return typeof document !== 'undefined' && document.querySelector('#tutor-rate-comments').value;
  }

  function getOtherUsername(props) {
    if (props.unratedSession) {

      let otherUserID;
      const loggedInUserID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);

      if (props.unratedSession.mentor_id === loggedInUserID) {
        otherUserID = props.unratedSession.student_id;
      } else {
        otherUserID = props.unratedSession.mentor_id;
      }

      for (let user of props.currentUserData) {
        if (user.id === otherUserID) {
          return user.username;
        }
      }
    }

    return props.otherUsername;

  }

  return (
    <div className='tutor-rate-container'>
      <div className="rate-tutor-header">
        Rate Tutor Session: <strong>{getOtherUsername(props)}</strong> {props.unratedSession && (
          '(' + formatDate(props.unratedSession.date_completed) + ')'
        )}
      </div>
      <div className="rate-tutor-stars">
        <ReactStars
          className={'tutor-rating'}
          size={80}
          starCount={5}
          value={rating}
          name={'rate-tutor'}
          onStarClick={onStarClick}
          onStarHover={onStarHover}
        />
      </div>
      <div className="rate-tutor-comments">
        <textarea name="tutor-rate-comment" id="tutor-rate-comments" cols="60" rows="7" placeholder='Comments...'></textarea>
      </div>
      {!props.unratedSession && (
        <div className="tutor-rate-btns-container">
          <div className="rate-tutor-btn" onClick={() => props.submitRating(props.currentTutorID, getIsMentor(props), rating, getTutorComments())}>
            Submit
        </div>
          <div className="tutor-btn tutor-btn-decline-cancel" onClick={() => props.cancelRateSession()}>
            Cancel
        </div>
        </div>
      )}
      {props.unratedSession && (
        <div className="rate-tutor-btn" onClick={() => props.otherUserSubmitRating(props.unratedSession, rating, getTutorComments())}>
          Submit
        </div>
      )}
    </div>
  )

}