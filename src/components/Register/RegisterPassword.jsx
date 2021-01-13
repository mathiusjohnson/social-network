import React, { useState } from 'react';
import { match } from 'assert';

export default function RegisterPassword(props) {

  const [passwordValue, setPasswordValue] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [matchMsg, setMatchMsg] = useState(false);

  function setInputValue(e) {
    setPasswordValue(e.target.value);
  }

  function currentInputValue() {
    return passwordValue;
  }

  function setError() {
    const currentVal = currentInputValue();

    if (!props.confirmPassword) {
      if (currentVal.length < 6 && currentVal.length > 0) {
        setErrorMsg(true);
      } else {
        setErrorMsg(false);
      }
    } else {
      const firstPassword = typeof document !== 'undefined' && document.querySelector('#password-input').value;

      if (currentVal.length > 5 && currentVal !== firstPassword) {
        setErrorMsg(true);
        setMatchMsg(false);
      } else if (currentVal.length > 5 && currentVal === firstPassword) {
        setMatchMsg(true);
        setErrorMsg(false);
      } else {
        setErrorMsg(false);
      }
    }
  }

  return (
    <div className={!props.confirmPassword ? 'register-password-container' : 'register-confirm-container'}>
      <div className="password-title register-title">
        {!props.confirmPassword ? 'Password: ' : 'Confirm Password: '}
      </div>
      <div className="password-input">
        <input
          type="password"
          className='register-input'
          id={!props.confirmPassword ? 'password-input' : 'confirm-password-input'}
          onChange={(e) => setInputValue(e)}
          value={currentInputValue()}
          onBlur={() => setError()}
        />
      </div>
      <div className={!props.confirmPassword ? "password-error register-error" : "confirm-error register-error"}>
        {errorMsg && !props.confirmPassword && (
          'Password must at least 5 characters!'
        )}
        {errorMsg && props.confirmPassword && (
          'Passwords do not match!'
        )}
      </div>
      <div className="password-match">
        {matchMsg && props.confirmPassword && (
          'Passwords match!'
        )}
      </div>
    </div>
  )

}