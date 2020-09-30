import React from "react";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { Link } from "@reach/router";
import { Button } from "@paljs/ui/Button";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Card, CardBody } from "@paljs/ui/Card";

export default function MentorListItem(props) {
  return (
    <div>
      <Row>
        <Col breakPoint={{ xs: 12 }}>
          <Card>
            <CardBody>
              <Link 
                to={`/messages/`}
                state={{username: props.username}}  
              >
                <Button>Message User</Button>
              </Link>
              <Link to={`/user-profiles/${props.username}`}>
                <img src={props.avatar} alt="avatar"></img>
                <h2>{props.username}</h2>
                <div>
                  <ProgressBar experience={props.experience} />
                </div>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
