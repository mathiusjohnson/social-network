import React, { useState } from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Card, CardBody } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import timeSince from "../../helpers/timeSince";
import CommentList from "./Comments/CommentList";
import CommentForm from "./Comments/NewComment";
import EditPostItem from "./EditPost";
import ContextConsumer from "../../context/context";
import useVisualMode from "../../hooks/useVisualMode";

const SHOW = "SHOW";
const CONFIRM = "CONFIRM";
const SAVING = "SAVING";
const EDITING = "EDITING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

function PostListItem(props) {
  const senderID = typeof document !== 'undefined' && document.cookie.split("=")[1];
  const [value, setValue] = React.useState("Comment here...");
  const { mode, transition, back } = useVisualMode(SHOW);
  const [error, setError] = useState("");

  function onDelete() {
    props.deletePost(props.post.post_id);
    // transition(EDITING);
  }

  function onEdit() {
    transition(EDITING);
  }

  function onSaveEdit() {
    transition(SHOW);
  }

  function onCancel() {
    back();
  }
  const commentData = props.comments.filter((comment) => {
    if (props.post.post_id === comment.post_id) {
      return comment;
    }
  });

  const commentList = commentData.map((comment, index) => {
    return (
      <CommentList
        key={index}
        index={props.index}
        avatar={comment.avatar}
        username={comment.username}
        text_body={comment.text_body}
      />
    );
  });

  return (
    <ContextConsumer>
      {({ data }) => {
        if (!data.state) return null;
        const currentUser = props.users.find(
          (user) => user.id === data.selected
        );
        const commentsLength = commentList.length;
        const commentObj = {
          avatar: currentUser.avatar,
          username: currentUser.username,
        };

        function onValidateComment() {
          if (value === "") {
            setError("Comment cannot be blank");
            return;
          }
          if (value !== "") {
            setError("");
            props.createComment(
              props.post.post_id,
              currentUser.id,
              value,
              commentObj)
              .then(() => {
                setValue("");
              });
          }
        }

        return (
          <Col
            className="post"
            key={props.index}
            breakPoint={{ xs: 12, md: 6 }}
          >
            <Card accent="Info">
              {mode === SHOW && (
                <CardBody>
                  {props.user.id === parseInt(senderID, 10) ? (
                    <div className="edit-post-button">
                      <Button
                        className="blue-button button-transition"
                        onClick={onEdit}
                      >
                        Edit
                      </Button>
                      <button
                        className="red-button red-button-transition"
                        onClick={onDelete}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                      ""
                    )}
                  <p className="time-posted">
                    {timeSince(props.post.time_posted)}{" "}
                  </p>
                  <p className="post-body">{props.post.text_body}</p>
                  <ul className="post-stack">
                    {/* <span className="bold">Stack:</span> */}
                    {props.post.stack.map((tech_stack, idx) => {
                      return <li key={idx}>{tech_stack}</li>;
                    })}
                  </ul>
                </CardBody>
              )}
              {mode === EDITING && (
                <EditPostItem
                  id={props.post.post_id}
                  time_posted={props.post.time_posted}
                  text_body={props.post.text_body}
                  stack={props.post.stack}
                  onSaveEdit={onSaveEdit}
                  user={currentUser}
                  updatePost={props.updatePost}
                />
              )}

              <div className="wrap-collabsible">
                <input
                  id={"collapsible" + props.index}
                  className="toggle"
                  type="checkbox"
                />
                <label htmlFor={"collapsible" + props.index} className="lbl-toggle">
                  Comments
                </label>
                <div className="collapsible-content">
                  <div className="content-inner">
                    {commentList}
                    <CommentForm
                      onValidateComment={onValidateComment}
                      error={error}
                      setError={setError}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        );
      }}
    </ContextConsumer>
  );
}

export default PostListItem;
