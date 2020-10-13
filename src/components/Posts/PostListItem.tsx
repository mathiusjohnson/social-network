import React, { useState } from "react";
import Col from "@paljs/ui/Col";
import { Card, CardBody } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import timeSince from "../../helpers/timeSince";
import CommentList from "./Comments/CommentList";
import CommentForm from "./Comments/NewComment";
import EditPostItem from "./EditPost";
import ContextConsumer from "../../context/context";
import useVisualMode from "../../hooks/useVisualMode";
import Likes from './Likes';
import './PostListItem.scss'
import { Link } from "@reach/router";

const SHOW = "SHOW";
// const CONFIRM = "CONFIRM";
// const SAVING = "SAVING";
const EDITING = "EDITING";
// const ERROR_SAVE = "ERROR_SAVE";
// const ERROR_DELETE = "ERROR_DELETE";

function PostListItem(props) {
  const senderID = typeof document !== 'undefined' && document.cookie.split("=")[1];
  const [value, setValue] = React.useState("Comment here...");
  const { mode, transition } = useVisualMode(SHOW);
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

  // function onCancel() {
  //   back();
  // }
  const commentData = props.comments.filter((comment: any) => {
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
        // const commentsLength = commentList.length;
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
				const myPost = currentUser.id === props.post.owner_id ;

				const timeAgo = timeSince(props.post.time_posted);


        return (
            <Card accent="Info">
							<div className="dashboard">
								{mode === SHOW && (
									<CardBody className="post-body">
									{ myPost ?
                  <div>
                    <div
                    className="blue-button button-transition edit-btn  float-right"
                    onClick={onEdit}
                    >
                    Edit
                    </div>
                    <div className="blue-button delete-button-transition delete-btn float-right" onClick={onDelete}>Delete</div> 
                  </div> : ""
                  }

                  {/* USERS DETAILS */}

                  <Link className="user-link" to={`/user-profiles/${props.post.username}`}>
                    <div className="user-card">
                      <div className="circle">
                        <img src={props.post.avatar} alt="avatar"></img>
                      </div>    
                      <span className="bg">
                        <h3>{props.post.username}</h3>
                      </span>
                    </div>
                  </Link>
                  <Link className="online-link" to={`/user-profiles/${props.post.username}`}>
                    <span>{props.post.active ? <h6>User is online</h6> : <h6>User is offline</h6>}
                    </span>
                  </Link>
                  {/* MESSAGE BUTTON */}
                  <div className="message-button">
                    <Link
                      className="user-link"
                      to={`/messages/`}
                      state={{ username: props.post.username }}
                    >
                      <div className="blue-button button-transition">Message User</div>
                    </Link>
                  </div>
                  <small className="float-right">{timeAgo}</small>
									</CardBody>
								)}

								{/* POST TEXT BODY */}
								{mode === SHOW && (
									<p className="text-body">{props.post.text_body}</p>
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
								{/* <h5 className="stack"> {stack}</h5> */}

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
											{/* FOR COMMENTING */}
											<div className="center-textarea">
												<textarea 
													className="comment-textarea"
													value={value}
													onChange={(event) => {
														setValue(event.target.value) 
														setError("")
													}}
													rows="2" placeholder="Leave a comment here.."
												></textarea>
											</div>
										</div>
									</div>
								</div>
								<div>
									<Likes 
										currentUser={currentUser}
										likes={props.likes}
										post={props.post}
										addLike={props.addLike}
										removeLike={props.removeLike}
									/>
								</div>
							</div>
            </Card>
        );
      }}
    </ContextConsumer>
  );
}

export default PostListItem;
