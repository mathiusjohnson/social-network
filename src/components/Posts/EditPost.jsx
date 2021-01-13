import React, { useState } from "react";
import timeSince from "../../helpers/timeSince";
import { Card, CardBody } from "@paljs/ui/Card";
import './EditPost.scss'
import './PostListItem.scss'

function EditPostItem(props) {
  //console.log("from edit post", props);
  const [post, setPost] = useState(props.text_body || "");
  let techTags = [];
  const onChangeInput = (selectedTags) => {
    techTags = selectedTags;
  };

  function onSave() {
    props.updatePost(post, props.id, props.user.id);
    props.onSaveEdit();
    // props.onSave();
  }
  return (
    <div className="dash-editor">
      <CardBody className="">

        <textarea
          className="edit-text-body on-top"
          type="text"
          value={post}
          onChange={(event) => setPost(event.target.value)}
          placeholder="Round border"
        />
        {/* <ul className="post-stack">
          <span className="bold">Stack:</span>
          {props.stack.map((tech_stack, idx) => {
            return <li key={idx}>{tech_stack}</li>;
          })}
        </ul>
        <Tags
          tags={props.stack}
          onChange={onChangeInput}
          suggested={props.suggestion}
        /> */}
        <div className="blue-button button-transition save-btn" onClick={onSave}>Save</div>
      </CardBody>
    </div>
  );
}

export default EditPostItem;
