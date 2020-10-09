import React from 'react';
import TutorBtn from './TutorBtn';
import timeSince from '../../helpers/timeSince';
import { formatDate, getMentorUsername, getStudentUsername, getDateStatus, getTimeAgo } from '../../helpers/tutor-helpers';
const classNames = require('class-names');

export default function TutorHistoryBodyItem(props) {

  // console.log('tutorHistoryBodyItem', props);

  const statusClass = classNames('tutor-history-item-status', {
    'item-status-pending': props.status === 'pending',
    'item-status-in-progress': props.status === 'in-progress',
    'item-status-completed': props.status === 'completed'
  })

  function isCreator(props) {
    return typeof document !== 'undefined' && Number(document.cookie.split('=')[1]) === props.creatorID;
  }

  function getUsername(props) {
    const myUserID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);

    let otherID;
    if (myUserID === props.mentorID) otherID = props.studentID;
    else otherID = props.mentorID;

    for (let user of props.currentUserData) {
      if (user.id === otherID) {
        return user.username;
      }
    }
    return null;
  }

  function getOtherUserID(props) {
    const currentUserID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);
    if (currentUserID === props.studentID) {
      return props.mentorID;
    }
    return props.studentID;
  }

  // console.log('timeAgo', getTimeAgo(props));

  return (
    <div className='tutor-history-item-container'>
      <div className="tutor-history-item-date">
        <div className="item-date-status">
          {getDateStatus(props)}: <strong>{formatDate(getTimeAgo(props))}</strong>
        </div>
        <div className="item-date-date">
          ({timeSince(getTimeAgo(props))})
        </div>
      </div>
      <div className="tutor-history-item-student-mentor">
        {getMentorUsername(props)} / {getStudentUsername(props)}
      </div>
      <div className={statusClass}>
        {props.status.slice(0, 1).toUpperCase() + props.status.slice(1)}
      </div>
      <div className="tutor-history-item-btns">
        {props.status === 'pending' && isCreator(props) && (
          <div className='tutor-btn-container'>
            <TutorBtn
              name={'Cancel'}
              onClick={() => props.declineCancelAction(props.id)}
            />
          </div>
        )}
        {props.status === 'pending' && !isCreator(props) && (
          <div className='tutor-btn-container'>
            <TutorBtn
              name={'Accept'}
              onClick={() => props.acceptAction(props.id)}
            />
            <TutorBtn
              name={'Decline'}
              onClick={() => props.declineCancelAction(props.id)}
            />
          </div>
        )}
        {props.status === 'in-progress' && (
          <div className='tutor-btn-container'>
            <TutorBtn
              name={'Video'}
              onClick={() => props.generateGoogleLink(getOtherUserID(props))}
            />
            <TutorBtn
              name={'Complete'}
              onClick={() => props.completeAction(props.id, getUsername(props))}
            />
          </div>
        )}
        {props.status === 'completed' && (
          <div className='tutor-btn-container'>
            <TutorBtn
            />
          </div>
        )}
      </div>
    </div>
  );

}