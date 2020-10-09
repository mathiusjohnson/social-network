import React from "react";
import axios from "axios";
import useApplicationData from "../../hooks/useApplicationData";
import setNotifications from '../../helpers/setNotifications';
import setUnseenTutor from '../../helpers/setUnseenTutor';
import ContextConsumer from "../../context/context";
import { Link } from "gatsby";

export default function LoginLogout() {
  const { state } = useApplicationData();

  function login(data, set) {
    const userID = typeof document !== 'undefined' && Number(document.querySelector("#login-user-id").value);
    document.cookie = `userID=${userID};`;

    axios.post("https://stack-network.herokuapp.com/api/login", { userID }).then((res) => {
      const username = res.data[0].username;
      console.log("data in login: ", res.data[0]);
      set({ ...data, state: state, selected: res.data[0].id });

      // MATT'S CODE************************************************************
      const avatar = res.data[0].avatar;
      const rightNavContainer = typeof document !== 'undefined' && document.querySelector(".sc-kEqYlL.efNBuU.right");

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
      axios.post('https://stack-network.herokuapp.com/api/messages/unread_count', { userID })
        .then(res => {
          setNotifications(Number(res.data[0].count));
          typeof localStorage !== 'undefined' && localStorage.setItem('unreadMessages', Number(res.data[0].count))
        })

      // MATT'S CODE FOR ADDING MESSAGES NOTIFICATIONS ON LOGIN************************************************************

      // MATT'S CODE FOR ADDING TUTOR SESSION NOTIFICATION ON LOGIN************************************************************

      axios.post('https://stack-network.herokuapp.com/api/tutor_experiences/unseen_count', { userID })
        .then(res => {
          console.log('unseen count', res.data[0]);
          setUnseenTutor(Number(res.data[0].count))
          typeof localStorage !== 'undefined' && localStorage.setItem('unreadTutor', Number(res.data[0].count))
        })

      // MATT'S CODE FOR ADDING TUTOR SESSION NOTIFICATION ON LOGIN************************************************************

    });
  }
  // console.log("State in login: ", state);
  function logout(data, set) {
    const currentUserID = typeof document !== 'undefined' && document.cookie.split('=')[1];
    document.cookie = `userID=${currentUserID}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    // MATT'S CODE************************************************************
    const userDisplay = typeof document !== 'undefined' && document.querySelector('.logged-in-username');

    if (userDisplay) {
      userDisplay.remove();
    }

    typeof localStorage !== 'undefined' && localStorage.removeItem('userID');
    typeof localStorage !== 'undefined' && localStorage.removeItem('username');
    typeof localStorage !== 'undefined' && localStorage.removeItem('avatarUrl');
    typeof localStorage !== 'undefined' && localStorage.removeItem('unreadMessages');
    typeof localStorage !== 'undefined' && localStorage.removeItem('unreadTutor');
    typeof localStorage !== 'undefined' && localStorage.removeItem('Login');
    // MATT'S CODE************************************************************
    set({ ...data, state: null, selected: null });

  }

  return (
    <ContextConsumer>
      {({ data, set }) => {
        return (
          <div>
            {/* <label htmlFor="login">User ID:</label>
            <select name="login" id="login-user-id">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select> */}
            {/* <button type="button" name="login" onClick={() => login(data, set)}>
              Login
              </button> */}
            <Link to={'/'}>
              <button type="button" name="logout" id='logout-btn-nav' onClick={() => logout(data, set)}>
                Logout
              </button>
            </Link>
          </div>
        )
      }}
    </ContextConsumer>
  );
}
