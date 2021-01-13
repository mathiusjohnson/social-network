import React from 'react';
import MessageButton from './MessageButton';
import MessageUsernameList from './MessageUsernameList';
import UsernameSearchFeature from '../UsernameSearch/UsernameSearchFeature';

export default function MessageHeader(props) {

  console.log('msgHeaderProps', props);

  let avatar;
  for (let item of props.avatarList) {
    if (item.username === props.username) {
      avatar = item.avatar;
    }
  }

  if (props.createNew) {
    avatar = null;
  }

  const currentUserID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);

  function getUsernameList(props) {

    const filteredList = props.avatarList.filter(item => {
      return item.id !== currentUserID;
    });

    return filteredList.map(item => {
      return item.username;
    });
  }

  return (
    <div className='message-text-header'>
      <div className='message-header-username'>
        <img src={avatar} alt="" />
        <div>{!props.createNew && props.username}</div>
        {props.createNew && (
          <div>
            <UsernameSearchFeature
              usernameList={getUsernameList(props)}
            />
          </div>
        )}
      </div>
      <div className='message-header-buttons'>
        <div className='tutor-session-title'> Tutor Session: </div>
        <MessageButton
          name={'Create'}
          create={true}
          displayCreateTutorSession={props.displayCreateTutorSession}
        />
      </div>
    </div>
  )
}