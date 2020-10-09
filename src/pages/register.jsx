import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RegisterUsername from '../components/Register/RegisterUsername';
import RegisterEmail from '../components/Register/RegisterEmail';
import RegisterPassword from '../components/Register/RegisterPassword';
import RegisterAvatarList from '../components/Register/RegisterAvatarList';
import '../styles/register.css';

export default function Register() {

  const [avatarList, setAvatarList] = useState([]);
  const [randomUsernameList, setRandomUsernameList] = useState([]);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const [showAvatarList, setShowAvatarList] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {

    const promiseAvatars = axios.get('https://stack-network.herokuapp.com/api/register/avatars');
    const promiseRandomUsernames = axios.get('https://stack-network.herokuapp.com/api/register/random_usernames')

    Promise.all([promiseAvatars, promiseRandomUsernames])
      .then(all => {

        const [avatarData, randomUsernameData] = all;

        console.log('random username data', randomUsernameData);
        console.log('avatar data', avatarData);

        const uniqueAvatars = [...new Set(avatarData.data)];
        const uniqueRandomUsernames = [...new Set(randomUsernameData.data)];

        setAvatarList(uniqueAvatars);
        setRandomUsernameList(uniqueRandomUsernames);
      })

  }, [])


  function selectAvatar(avatarUrl) {
    setSelectedAvatarUrl(avatarUrl);
  }

  function toggleAvatarList() {
    !showAvatarList ? setShowAvatarList(true) : setShowAvatarList(false);
  }

  // ERROR HANDLING ON SUBMIT
  function handleSubmit() {
    setSubmitError('');
    const registerErrors = typeof document !== 'undefined' && document.querySelectorAll('.register-error');
    if (registerErrors) {

      for (let error of registerErrors) {
        if (error.textContent) {
          setSubmitError('Please check error messages before submitting!');
          return;
        }
      }
    }

    const userInputs = typeof document !== 'undefined' && document.querySelectorAll('.register-input');
    if (userInputs) {

      for (let input of userInputs) {
        if (!input.value.length) {
          setSubmitError('At least one field is left blank!');
          return;
        }
      }
    }
    const avatarSrc = typeof document !== 'undefined' && document.querySelector('.selected-avatar').children[0].src;
    console.log(avatarSrc);
    if (avatarSrc === 'http://localhost:8000/register') {
      setSubmitError('Please select avatar!');
      return;
    }

    const usernameInput = typeof document !== 'undefined' && document.querySelector('#username-input').value;
    const emailInput = typeof document !== 'undefined' && document.querySelector('#email-input').value;
    const passwordInput = typeof document !== 'undefined' && document.querySelector('#password-input').value;

    axios.post('https://stack-network.herokuapp.com/api/register/new', { usernameInput, emailInput, passwordInput, avatarSrc })
      .then(res => {
        console.log(res);
        setSubmitSuccess(true);

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);

      })

  }



  return (
    <div className='register-main-container'>
      <div className="register-main-title">
        Sign up for Stack!
      </div>
      <RegisterUsername
        randomUsernameList={randomUsernameList}
      />
      <RegisterEmail />
      <RegisterPassword
        confirmPassword={false}
      />
      <RegisterPassword
        confirmPassword={true}
      />
      <RegisterAvatarList
        avatarList={avatarList}
        selectAvatar={selectAvatar}
        selectedAvatarUrl={selectedAvatarUrl}
        toggleAvatarList={toggleAvatarList}
        showAvatarList={showAvatarList}
      />
      <div className="register-btn-container">
        <div className="register-btn" onClick={() => handleSubmit()}>
          REGISTER
        </div>
        <div className="submit-error-container">
          {submitError && (
            submitError
          )}
        </div>
        <div className="submit-success-container">
          {submitSuccess && (
            'Registration successful!'
          )}
        </div>
      </div>
    </div>
  )

}