import React from 'react';

export default function TutorShowPoints(props) {

  return (
    <div className='tutor-points-container'>
      <div className="tutor-points-title">
        You gave {props.pointsArray[0]} <strong>{props.pointsArray[1] * 3} experience points!</strong>
      </div>
    </div>
  )

}