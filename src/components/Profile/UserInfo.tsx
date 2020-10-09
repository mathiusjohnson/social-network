import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import React from "react";
import { Button } from "@paljs/ui/Button";
import Stack from "./UserStack";

import Experience from "./UserExperience";
import { Card, CardBody } from "@paljs/ui/Card";
import { Link } from "@reach/router";

function UserInfo(props) {
  const senderID = typeof document !== 'undefined' && document.cookie.split("=")[1];
  if (!props.user) return null;
  console.log("props in userinfo: ", props.user);

  return (
    <Card>
      <CardBody>
        <div className="user-info">
          <Row>
            <Col
              className="avatar"
              breakPoint={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            >
              <div className="avatar-container">
                <img src={props.user.avatar} alt="avatar" />
              </div>
              <div>
                {props.user.active ? (
                  <p className="status">
                    User is <span className="online">online</span>
                  </p>
                ) : (
                    <p className="status">
                      User is <span className="offline">offline</span>
                    </p>
                  )}
              </div>
              <p className="username">
                <span>@</span>
                {props.user.username}
                <span> ({props.user.location})</span>
              </p>
            </Col>
            <Col breakPoint={{ xs: 12, sm: 12, md: 12, lg: 12 }}></Col>
            <Col breakPoint={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
              <Stack mentor={props.mentor_stack} />
            </Col>
            {/* <Col breakPoint={{ xs: 12, sm: 12, md: 12, lg: 12 }}> */}
            <Experience
              mentor={props.user.mentorrating}
              student={props.user.studentrating}
              user={props.user}
            />
            {/* </Col> */}
          </Row>
          <Row>
            {props.user.id === parseInt(senderID, 10) ? (
              <button
                fullWidth
                appearance="hero"
                className="green-button green button-transition"
                onClick={props.onEdit}
              >
                Edit
              </button>
            ) : (
                <Link to={`/messages/`} state={{ username: props.user.username }}>
                  <button
                    fullWidth
                    appearance="hero"
                    className="green-button green button-transition"
                  // onClick={props.onEdit}
                  >
                    Message
                </button>
                </Link>
              )}
          </Row>
        </div>
      </CardBody>
    </Card>
  );
}

export default UserInfo;
