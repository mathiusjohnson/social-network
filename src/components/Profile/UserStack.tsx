import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import React from "react";

function Stack(props) {
  //console.log("from USER STACK", props);
  const mentorStack = props.mentor.map((stack, index) => {
    return <li key={index}>{stack.name} </li>;
  });

  return (
    <Row>
      <Col breakPoint={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        <ul className="stack">
          <span className="bold">Mentor Stack:</span>
          {mentorStack}
        </ul>
      </Col>
    </Row>
  );
}

export default Stack;
