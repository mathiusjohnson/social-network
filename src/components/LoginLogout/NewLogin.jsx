import React, { useEffect, useState } from 'react';
import '../../styles/login.css';
import axios from 'axios';
import { Link } from "@reach/router";
import setNotifications from '../../helpers/setNotifications';
import setUnseenTutor from '../../helpers/setUnseenTutor';
import ContextConsumer from "../../context/context";
import useApplicationData from "../../hooks/useApplicationData";

export default function Login() {
  const { state } = useApplicationData();

  const [avatarList, setAvatarList] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [count, setCount] = useState(0);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {

    const promiseAvatars = axios.get('https://stack-social-network.herokuapp.com/api/register/avatars');

    Promise.all([promiseAvatars])
      .then(all => {

        const [avatarData] = all;
        console.log('avatar data', avatarData.data);

        const uniqueAvatars = [...new Set(avatarData.data)];

        setAvatarList(uniqueAvatars);
      })

  }, []);

  function randomizeAvatar() {
    const randomNum = Math.floor(Math.random() * avatarList.length);

    const randomAvatar = avatarList[randomNum];

    if (randomAvatar) {
      return randomAvatar.url.replace(/50/g, 400);
    }
  }

  useEffect(() => {
    const avatarUrl = randomizeAvatar(avatarList);
    setCurrentAvatar(avatarUrl);
    setTimeout(() => {
      setCount(count + 1);
    }, 2000);
  }, [count]);

  function userLogin(username, password, data, set) {

    // if either username or password are blank
    if (!username || !password) {
      setErrorMsg('Username/password is left blank!');
      setTimeout(() => {
        setErrorMsg('');
      }, 2500)
      return;
    }

    axios.post("https://stack-social-network.herokuapp.com/api/login-real", { username, password })
      .then((res) => {
        console.log('res', res.data);
        // if username/password are correct
        if (res.data.length) {

          const username = res.data[0].username;
          const userID = res.data[0].id
          const avatar = res.data[0].avatar;

          document.cookie = `userID=${userID};`;

          console.log('username', username)
          console.log('userId', userID)
          console.log('avatat', avatar)
          set({ ...data, state: state, selected: res.data[0].id });

          // MATT'S CODE************************************************************
          const rightNavContainer = typeof document !== 'undefined' && document.querySelector(".sc-kEqYlL.gyZWym.right");

          const userDisplay = typeof document !== 'undefined' && document.querySelector('.logged-in-username');

          if (userDisplay) {
            userDisplay.remove();
          }

          const usernameHTML = `
            <div class='logged-in-username' style='display: flex; align-items: center; justify-content: center'>
            <p style='margin-right: 0.5rem;'>Welcome <strong>${username}!</strong></p>
            <img src='${avatar}' />
            </div>
        `;

          if (rightNavContainer) {
            rightNavContainer.insertAdjacentHTML("afterbegin", usernameHTML);
          }

          // MATT'S CODE************************************************************
          typeof localStorage !== 'undefined' && localStorage.setItem('userID', userID);
          typeof localStorage !== 'undefined' && localStorage.setItem('username', username);
          typeof localStorage !== 'undefined' && localStorage.setItem('avatarUrl', avatar);
          // MATT'S CODE************************************************************

          // MATT'S CODE FOR ADDING MESSAGES NOTIFICATIONS ON LOGIN************************************************************
          axios.post('https://stack-social-network.herokuapp.com/api/messages/unread_count', { userID })
            .then(res => {
              setNotifications(Number(res.data[0].count));
              typeof localStorage !== 'undefined' && localStorage.setItem('unreadMessages', Number(res.data[0].count))
            })

          // MATT'S CODE FOR ADDING MESSAGES NOTIFICATIONS ON LOGIN************************************************************

          // MATT'S CODE FOR ADDING TUTOR SESSION NOTIFICATION ON LOGIN************************************************************

          axios.post('https://stack-social-network.herokuapp.com/api/tutor_experiences/unseen_count', { userID })
            .then(res => {
              console.log('unseen count', res.data[0]);
              setUnseenTutor(Number(res.data[0].count))
              typeof localStorage !== 'undefined' && localStorage.setItem('unreadTutor', Number(res.data[0].count))
            })

          // MATT'S CODE FOR ADDING TUTOR SESSION NOTIFICATION ON LOGIN************************************************************

          // display login page
          const allMenuTitles = typeof document !== 'undefined' && document.querySelectorAll('.menu-title');
          let loginMenuTitle;
          if (allMenuTitles) {

            for (let title of allMenuTitles) {
              if (title.textContent === 'Login') {
                loginMenuTitle = title;
              }
            }
          }

          console.log('loginMenuTItle', loginMenuTitle);
          let loginMenuTitleParent;
          if (loginMenuTitle) {
            loginMenuTitleParent = loginMenuTitle.parentElement.parentElement;
          }
          console.log('parent', loginMenuTitleParent);

          loginMenuTitle.textContent = 'Logout';
          loginMenuTitle.classList.add('logout-btn-enabled');
          typeof localStorage !== 'undefined' && localStorage.setItem('Login', true);

          // redirect to home page
          setRedirect(true);

        } else {
          // if username or password are not correct
          setErrorMsg('Username/password are incorrect!');
          setTimeout(() => {
            setErrorMsg('');
          }, 2500)
          return;
        }
      });

  }


  return (
    <ContextConsumer>
      {({ data, set }) => {
        return (
          <div className='main-login-container'>
            <div className="login-left-container">
              <div className="login-form-header">Welcome to Stack!</div>
              <div className="login-username-container">
                <img src="https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg" alt="" id='username-icon' />
                <input
                  type="text"
                  className='register-input'
                  id='login-username-input'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Username'
                />
              </div>
              <div className="login-password-container">
                <img src="https://www.flaticon.com/svg/static/icons/svg/526/526812.svg" alt="" id='password-icon' />
                <input
                  type="password"
                  className='register-input'
                  id='login-password-input'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                />
              </div>
              {errorMsg && (
                <div className="login-username-password-error">{errorMsg}</div>
              )}
              <div className="login-btn" onClick={() => userLogin(username, password, data, set)}>
                LOGIN
              </div>
              <div className="no-account">
                Don't have an account yet? Register&nbsp;
                <Link to={`/register/`}><span id='register-account-click'>here</span>
                </Link>
              </div>
              {redirect && (
                <Link to={'/dashboard/'} className='dashboard-redirect'></Link>
              )}
            </div>
            <div className="login-right-container">
              <img src={currentAvatar ? currentAvatar : 'https://robohash.org/voluptatemnemolaborum.png?size=400x400&set=set1'} alt="" />
            </div>
          </div>
        )
      }}
    </ContextConsumer>
  )

}