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
    const userID = Number(document.querySelector("#login-user-id").value);
    document.cookie = `userID=${userID};`;

    axios.post("http://localhost:8001/api/login", { userID }).then((res) => {
      const username = res.data[0].username;

      set({ ...data, state: state, selected: res.data[0].username });

      // MATT'S CODE************************************************************
      const avatar = res.data[0].avatar;
      const rightNavContainer = document.querySelector(".sc-kEqYlL.gyZWym.right");

      const userDisplay = document.querySelector('.logged-in-username');

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
      localStorage.setItem('userID', userID);
      localStorage.setItem('username', username);
      localStorage.setItem('avatarUrl', avatar);
      // MATT'S CODE************************************************************

      // MATT'S CODE FOR ADDING MESSAGES NOTIFICATIONS ON LOGIN************************************************************
      axios.post('http://localhost:8001/api/messages/unread_count', { userID })
        .then(res => {
          setNotifications(Number(res.data[0].count));
          localStorage.setItem('unreadMessages', Number(res.data[0].count))
        })

      // MATT'S CODE FOR ADDING MESSAGES NOTIFICATIONS ON LOGIN************************************************************

      // MATT'S CODE FOR ADDING TUTOR SESSION NOTIFICATION ON LOGIN************************************************************

      axios.post('http://localhost:8001/api/tutor_experiences/unseen_count', { userID })
        .then(res => {
          console.log('unseen count', res.data[0]);
          setUnseenTutor(Number(res.data[0].count))
          localStorage.setItem('unreadTutor', Number(res.data[0].count))
        })

      // MATT'S CODE FOR ADDING TUTOR SESSION NOTIFICATION ON LOGIN************************************************************

    });
  }
  // console.log("State in login: ", state);
  function logout() {
    document.cookie = `userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    // MATT'S CODE************************************************************
    const userDisplay = document.querySelector('.logged-in-username');

    if (userDisplay) {
      userDisplay.remove();
    }

    localStorage.removeItem('userID');
    localStorage.removeItem('username');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('unreadMessages');
    // MATT'S CODE************************************************************
  }

  return (
    <ContextConsumer>
      {({ data, set }) => {
        return (
          <div>
            <label htmlFor="login">User ID:</label>
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
            </select>
            <button type="button" name="login" onClick={() => login(data, set)}>
              Login
              </button>
            <Link to={'/'}>
              <button type="button" name="logout" onClick={() => logout()}>
                Logout
              </button>
            </Link>
          </div>
        )
      }}
    </ContextConsumer>
  );
}
