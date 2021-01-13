import React from "react";
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Card, CardBody } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import { Link } from "@reach/router";
import "./UserListItem.scss";

export default function UserListItem(props) {	
	const stack = props.mentor_stack.map((stack, index) => {
    if (stack.user_id === props.userId) {
			
      return <li className="list" key={index}>{stack.name}&nbsp;</li>
    }
	})
	console.log("props stack: ", props);
	
  return (
    <div className="userlist">
      <div>
        <Row>
          <Col breakPoint={{ xs: 12 }}>
            <Card>
              <CardBody className="post-body">
                  {/* EXPERIENCE BARS */}
                <div className="experience-bars">
                  <div className="mentor-xp-bar">
                    {props.mentorExperience ? 
                      <h4>Mentor Level</h4>
                    : ""}
                    {props.mentorExperience ? 
                      <ProgressBar 
                        experience={Number(props.mentorExperience)}
                      />
                    : ""}
                  </div>
                  <div className="student-xp-bar">
                    {props.studentExperience ? 
                      <h4>Student Level</h4>
                    : ""}
                    {props.studentExperience ? 
                      <ProgressBar
                        experience={Number(props.studentExperience)}
                      />
                    : ""}
                  </div>
                  {!props.studentExperience && !props.mentorExperience ? 
                  <div className="new-user">
                    <h4>{props.username} is new.</h4>
                    <h5>Invite them for a <Link className="tutor-link" to='/tutor-sessions'>tutor session</Link> to help them get on the experience board!</h5>
                  </div>
                  : ""}
                </div>
                {/* USERS DETAILS */}
                <div className="centered-user-deets">
                  <Link className="user-link" to={`/user-profiles/${props.username}`}>
                    <span className="user-card">
                      <span className="circle">
                        <img src={props.avatar} alt="avatar"></img>
                      </span>    
                      <span className="bg">
                        <h3>{props.username}</h3>
                      </span>
                    </span>
                  </Link>
                  <Link className="online-link" to={`/user-profiles/${props.username}`}>
                    <span>{props.active ? <h6>User is online</h6> : <h6>User is offline</h6>}
                    </span>
                  </Link>
                </div>

                {/* MESSAGE BUTTON */}
                <div className="message-button">
                  <Link
                    to={`/messages/`}
                    className="no-decoration"
                    state={{ username: props.username }}
                  >
                  <div className="blue-button button-transition">Message User</div>
                  </Link>
                </div>
                {/* POST STACK LIST */}
                <div className="stack">
                  <span className="language-title">Language Preferences:&nbsp;</span><span>{stack}</span>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}