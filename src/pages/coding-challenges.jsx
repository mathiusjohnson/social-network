import React, { useEffect, useState } from 'react';
import CodingHeader from '../components/CodingChallenges/CodingHeader';
import CodingChallengesContainer from '../components/CodingChallenges/CodingChallengesContainer';
import CodingSpaceContainer from '../components/CodingChallenges/CodingSpaceContainer';
import axios from 'axios';
import '../styles/coding-challenges.css'
import ContextConsumer from '../context/context'
import NewLogin from '../components/LoginLogout/NewLogin'

export default function CodingChallenges() {

  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [userCompletedChallenges, setUserCompletedChallenges] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);
  const [currentFunctionTitle, setCurrentFunctionTitle] = useState('');
  const [currentAllTests, setCurrentAllTests] = useState([]);
  const [currentTests, setCurrentTests] = useState([]);

  useEffect(() => {

    let userID = typeof document !== 'undefined' && document.cookie.split('=')[1];
    if (userID) userID = Number(userID);

    const promiseUserChallenges = axios.get('https://stack-social-network.herokuapp.com/api/user_challenges');
    const promiseUserInfo = axios.post('https://stack-social-network.herokuapp.com/api/login', { userID });
    const promiseAllChallenges = axios.get('https://stack-social-network.herokuapp.com/api/challenges/all');
    const promiseTests = axios.get('https://stack-social-network.herokuapp.com/api/challenges/tests');

    Promise.all([promiseUserChallenges, promiseUserInfo, promiseAllChallenges, promiseTests])
      .then(all => {

        let [userChallengeData, userInfo, allChallenges, allTests] = all;

        userChallengeData = userChallengeData.data;
        userInfo = userInfo.data;
        allChallenges = allChallenges.data;
        allTests = allTests.data
        // console.log('userChallengeData', userChallengeData);
        // console.log('userInfo', userInfo);
        // console.log('allChallenges', allChallenges);
        console.log('allTests', allTests);
        // console.log('userID', userID);

        // completed and userID
        const filteredChallengeData = userChallengeData.filter(challenge => {
          return challenge.user_id === userID && challenge.completed;
        });
        // console.log('filteredChallengeData', filteredChallengeData);
        setUserCompletedChallenges(filteredChallengeData);
        setCurrentUserInfo(userInfo[0]);
        setAllChallenges(allChallenges);
        setCurrentAllTests(allTests);
      });

  }, []);

  function setFunctionTitle(title) {

    let functionTitle = title.split(' ');

    const firstFunctionTitle = functionTitle[0].toLowerCase();
    const restFunctionTitle = functionTitle.slice(1).join('');

    functionTitle = `function ${firstFunctionTitle + restFunctionTitle}(params) {
    // code here
   }`;

    setCurrentFunctionTitle(functionTitle);
  }

  function setCodingTests(id) {
    let testsArr = [];
    console.log('currentAll', currentAllTests);
    for (let test of currentAllTests) {
      if (test.coding_challenge_id === id) {
        testsArr.push(test);
      }
    }

    setCurrentTests(testsArr);
  }


  return (
    <ContextConsumer>
      {({ data }) => {
        if (!data.state) return (
          <NewLogin></NewLogin>
        )
        return (
          <div className='coding-challenges-main-container'>
            <CodingHeader
              userInfo={currentUserInfo}
              completedChallenges={userCompletedChallenges}
            />
            <CodingChallengesContainer
              allChallenges={allChallenges}
              completedChallenges={userCompletedChallenges}
              setFunctionTitle={setFunctionTitle}
              setCodingTests={setCodingTests}
            />
            <CodingSpaceContainer
              currentFunction={currentFunctionTitle}
              currentTests={currentTests}
            />
          </div>
        );
      }}
    </ContextConsumer>
  );

}