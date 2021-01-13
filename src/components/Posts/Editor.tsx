import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Checkbox } from "@paljs/ui/Checkbox";
import Tags from "./StackTag";
import ContextConsumer from "../../context/context";
import Col from "@paljs/ui/Col";
import "./Editor.scss";

function Editor(props) {
  const [value, setValue] = React.useState();
  const [checkbox, setCheckbox] = React.useState({
    1: false,
  });
  const [error, setError] = useState("");

  const onChangeCheckbox = (value: boolean, name: number) => {
    setCheckbox({ ...checkbox, [name]: value });
  };

  let avatarUrl, userID, username;
  if (typeof localStorage !== 'undefined') {
    avatarUrl = typeof localStorage !== 'undefined' && localStorage.avatarUrl
    userID = typeof localStorage !== 'undefined' && localStorage.userID
    username = typeof localStorage !== 'undefined' && localStorage.usreUrl
  }
  // const { avatarUrl, userID, username } = localStorage;

  return (
    <>
      <ContextConsumer>
        {({ data }) => {
          if (!data.state) return null;
          const currentUser = props.users.find(
            (user) => user.id === data.selected
          );

          let techTags = [];
          const onChangeInput = (selectedTags) => {
            // console.log("HELLOOOOO");
            techTags = selectedTags;
          };

          const postObj = {
            text: value,
            mentor: checkbox[1],
            avatar: avatarUrl,
            username: username,
            stack: techTags,
          };

          function validatePost() {
            if (value === "") {
              setError("Post cannot be blank");
              return;
            }
            if (value !== "") {
              setError("");
              props.createPost(postObj, techTags, currentUser.id).then(() => {
                setValue("");
              });
            }
          }
          return (
            <>
              <div className="flex">
                <MDEditor className="editor" value={value} onChange={setValue} />
                <div className="flex-row">
                  <div className="tags">
                    <Tags suggested={props.suggestion} onChange={onChangeInput} />
                  </div>
                  <div className="checkbox">
                    <Checkbox
                      checked={checkbox[1]}
                      status="Success"
                      onChange={(value) => onChangeCheckbox(value, 1)}
                    >
                      Mentor Help Needed
                  </Checkbox>
                  </div>
                </div>
                <Col key={1} offset={{ xs: 11 - 1 }} breakPoint={{ xs: 1 + 1 }}>
                  <div
                    className="post-btn"
                    onClick={() => validatePost()}
                  >
                    Post
                </div>
                </Col>
              </div>
              <div>
                <section className="validation">{error}</section>
              </div>
            </>
          );
        }}
      </ContextConsumer>
    </>
  );
}

export default Editor;
