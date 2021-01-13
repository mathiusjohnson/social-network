import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/messages.css';
import '../../styles/tutor-sessions.css'
import MessageList from './MessageList';
import MessageView from './MessageView';
import MessageHeader from './MessageHeader';
import MessageTextArea from './MessageTextArea';
import MessageListHeader from './MessageListHeader';
import MessageTutorCreate from './MessageTutorCreate';
import MessageTutorSuccess from './MessageTutorSuccess';
import messageCleanSort from '../../helpers/messageHelpers';
import unreadCounter from '../../helpers/unreadCounter';

export default function Messages(props) {

  const [messageList, setMessageList] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [avatars, setAvatars] = useState([]);
  const [createNew, setCreateNew] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [routeUsername, setRouteUsername] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);
  const [usernamesUnread, setUsernamesUnread] = useState([]);

  useEffect(() => {

    const userID = typeof document !== 'undefined' && document.cookie.split('=')[1];

    axios.post('https://stack-social-network.herokuapp.com/api/messages/', { userID })
      .then((data) => {
        const currentUserID = data.data.userId;
        const currentData = data.data.data;

        const unreadCount = unreadCounter(Number(userID), currentData);
        setTotalUnread(unreadCount);
        // console.log('unreadCount', unreadCount);
        setNotifications(unreadCount);

        // insert into local storage ***********
        typeof localStorage !== 'undefined' && localStorage.setItem('unreadMessages', unreadCount);

        setCurrentData(currentData);

        const newMessageList = messageCleanSort(currentUserID, currentData);

        console.log('messageList', newMessageList);

        setMessageList({ messageList: newMessageList });

        const username = typeof document !== 'undefined' && document.querySelector('.message-header-username').textContent;

        let intMessages = [];

        for (let msg of currentData) {
          if (msg.sender === username || msg.receiver === username) {
            intMessages.push(msg);
          }
        }

        intMessages.sort((a, b) => new Date(b.time_sent) - new Date(a.time_sent))
        setCurrentMessages(intMessages);

        if (currentUsername) {
          changeBg(currentUsername);
        }

        console.log('currentData', currentData);
        let usernamesNotRead = [];
        for (let message of currentData) {
          if (message.senderid !== userID && !message.receiver_read && message.sender) {
            usernamesNotRead.push(message.sender);
          }
        }
        usernamesNotRead = [...new Set(usernamesNotRead)];
        console.log('usernamesNotRead', usernamesNotRead);
        setUsernamesUnread(usernamesNotRead);

      });

  }, [count]);

  useEffect(() => {
    axios.get('https://stack-social-network.herokuapp.com/api/user_profiles')
      .then(res => {
        setAvatars(res.data);
      })
  }, [])

  function setNotifications(notifNum) {
    console.log('notifNum', notifNum);

    const allMenuTitles = document.querySelectorAll('.menu-title');
    if (allMenuTitles) {

      for (let title of allMenuTitles) {
        if (title.textContent === 'Messages') {

          title.parentElement.style.position = 'relative';

          if (typeof document !== 'undefined' && document.querySelector('.message-notification-num')) {
            document.querySelector('.message-notification-num').remove();
          }

          const notificationHTML = `
          <div class='message-notification-num'>${notifNum}</div>
          `;

          if (notifNum) {
            title.insertAdjacentHTML('afterend', notificationHTML);
          }
        }
      }
    }

  }

  function changeBg(username, deselectBG) {

    const msgUsername = typeof document !== 'undefined' && document.querySelectorAll('.message-username');
    let currentEl;
    if (msgUsername) {

      for (let item of msgUsername) {
        if (item.textContent === username) {
          currentEl = item.parentElement.parentElement;
        }
      }

    }
    const msgTextContainers = typeof document !== 'undefined' && document.querySelectorAll('.message-item-container');

    if (msgTextContainers) {

      for (let item of msgTextContainers) {
        item.classList.remove('message-list-selected');
      }
    }

    if (!deselectBG && currentEl) {
      currentEl.classList.add('message-list-selected');
    }
  }


  function clickMe(username) {
    setCreateNew(false);
    setCurrentUsername(username);

    let intMessages = [];

    for (let msg of currentData) {
      if (msg.sender === username || msg.receiver === username) {
        intMessages.push(msg);
      }
    }

    intMessages.sort((a, b) => new Date(b.time_sent) - new Date(a.time_sent))
    setCurrentMessages(intMessages);

    if (typeof document !== 'undefined' && document.querySelector('#msg-textarea')) {
      document.querySelector('#msg-textarea').value = '';
    }
    changeBg(username);

    console.log('intMessages', intMessages);

    let otherUserID;
    if (intMessages.length) {
      otherUserID = intMessages[0].senderid ? intMessages[0].senderid : intMessages[0].receiverid;
    }

    const currentUserID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);

    axios.put('https://stack-social-network.herokuapp.com/api/messages/read', { currentUserID, otherUserID })
      .then(() => {
        setCount(count + 1);
      })
  }

  function submitMessage() {

    let selectedUsername;

    if (createNew) {
      selectedUsername = typeof document !== 'undefined' && document.querySelector('#search-user-input').value;
    }

    const textInput = typeof document !== 'undefined' && document.querySelector('#msg-textarea').value;

    let receiverID;


    if (!createNew) {
      if (typeof document !== 'undefined' && document.querySelector('.text-container')) {
        receiverID = typeof document !== 'undefined' && document.querySelector('.text-container').id;
      }
      else if (typeof document !== 'undefined' && document.querySelector('.message-header-username').children[1].textContent) {
        const intUsername = typeof document !== 'undefined' && document.querySelector('.message-header-username').children[1].textContent;

        for (let user of avatars) {
          if (user.username === intUsername) {
            receiverID = user.id;
          }
        }
      } else {
        console.log('hello');
        return;
      }
    } else {
      for (let user of avatars) {
        if (user.username === selectedUsername) {
          receiverID = user.id;
        }
      }
    }

    // error handling for if user message feed isn't clicked on
    if (!receiverID) {
      return;
    }

    // error handling for blank inputs
    if (!textInput) {
      const errorContainer = typeof document !== 'undefined' && document.querySelector('.error-container');
      errorContainer.style.display = 'block';

      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, 2000);

    } else {
      const senderID = typeof document !== 'undefined' && document.cookie.split('=')[1];

      axios.post('https://stack-social-network.herokuapp.com/api/messages/new', { textInput, receiverID, senderID })
        .then((res) => {
          console.log('resssss', res);
          if (createNew) {
            setCurrentUsername(selectedUsername);
            setTimeout(() => {
              changeBg(selectedUsername);
            }, 20);
          }
          setCount(count + 1);
          if (typeof document !== 'undefined') document.querySelector('#msg-textarea').value = '';


          setCreateNew(false);
        })
    }

  }

  function createNewMsg() {
    setCreateNew(true);
    changeBg(currentUsername, true);
  }

  // CREATE TUTOR SESSION STUFF ***************************************

  function displayCreateTutorSession() {
    setShowTutor(true);
  }

  function createTutorSession() {
    const radios = typeof document !== 'undefined' && document.getElementsByName('radio-mentor-student');
    let radioChecked;
    for (let radio of radios) {
      if (radio.checked) {
        radioChecked = radio.id;
      }
    }

    const username = typeof document !== 'undefined' && document.querySelector('#search-user-input').value;

    if (!username) {
      setCreateError('username');

      setTimeout(() => {
        setCreateError('');
      }, 2000);

      return;
    }

    let receiverID;
    for (let user of avatars) {
      if (user.username === username) {
        receiverID = user.id;
      }
    }
    const creatorID = typeof document !== 'undefined' && Number(document.cookie.split('=')[1]);

    let mentorID, studentID;
    if (radioChecked === 'mentor') {
      mentorID = receiverID
      studentID = creatorID;
    } else {
      mentorID = creatorID;
      studentID = receiverID;
    }

    // error handling for username not present
    if (!receiverID) {
      setCreateError('username');

      setTimeout(() => {
        setCreateError('');
      }, 2000);
      return;
    } else {
      axios.post('https://stack-social-network.herokuapp.com/api/tutor_experiences/new', { mentorID, studentID, creatorID })
        .then(() => {
          setShowTutor(false);
          setCount(count + 1);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 2500)
        })
    }
  }

  function cancelTutorSession() {
    setShowTutor(false);
  }

  // CREATE TUTOR SESSION STUFF ***************************************

  // ROUTE FROM OTHER PAGE FOR SENDING MSG *********************************

  const usernameRoute = props.location.state.username;

  if (usernameRoute && !routeUsername) {
    setRouteUsername(usernameRoute);
    clickMe(usernameRoute);
  }
  // ROUTE FROM OTHER PAGE FOR SENDING MSG *********************************

  return (
    <div className="outside-main-message">
      {showTutor && (
        <MessageTutorCreate
          avatarList={avatars}
          createTutorSession={createTutorSession}
          cancelTutorSession={cancelTutorSession}
          createError={createError}
        />
      )}
      {showSuccess && (
        <MessageTutorSuccess />
      )}
      <div className='main-message-container'>
        <div className='left-message-container'>
          <MessageListHeader
            createNewMsg={createNewMsg}
          />
          <MessageList
            messageList={messageList}
            clickMe={clickMe}
            username={currentUsername}
            avatarList={avatars}
            usernamesUnread={usernamesUnread}
          />
        </div>
        <div className='right-message-container'>
          <MessageHeader
            username={currentUsername}
            avatarList={avatars}
            createNew={createNew}
            displayCreateTutorSession={displayCreateTutorSession}
          />
          <MessageView
            currentMessages={currentMessages}
            createNew={createNew}
          />
          <MessageTextArea
            submitMessage={submitMessage}
            username={currentUsername}
          />
        </div>
      </div>
    </div>
  );

}