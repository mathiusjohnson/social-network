import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from "react";
import { Card, CardBody } from "@paljs/ui/Card";
import { Link } from "@reach/router";
import ContextConsumer from "../../context/context";
import "./PostListItem.scss";
import timeSince from "../../helpers/timeSince";
import useVisualMode from "../../hooks/useVisualMode";
import EditPostItem from "./EditPost"
interface IProps {
  key: number;
  post: IPost;
  likes: ILikes;
  active: boolean;
  comments: IComments;
  comment: object;
  addLike: (post_id: number, liker_id: number) => void;
  removeLike: (post_id: number, liker_id: number) => void;
  onClick: () => void;
  id: number;
  data: any;
  users: IUsers;
  createComment: (
    post_id: number,
    commenter_id: number,
    text_body: string,
    comment_details: (avatar: any, username: any) => void
  ) => void;
  removeComment: (
    post_id: number,
    commenter_id: number,
    text_body: string
  ) => void;
  editComment: (
    post_id: number,
    commenter_id: number,
    text_body: string,
    value: string
  ) => void;
  onChange: () => void;
  then: () => void;
  deletePost: (
    post_id: number,
  ) => void;
  updatePost: (
    editedPost: string,
    post_id: number,
    id: number
  ) => void;
}

interface IUsers {
  [index: number]: { id: number; user_id: number; name: string };
}

interface IComments {
  [index: number]: { id: number; user_id: number; name: string, post_id: number, text_body: string };
}

interface ILikes {
  [index: number]: { id: number; user_id: number; name: string };
}

interface IPost {
  avatar: string;
  studentrating: string;
  text_body: string;
  active: boolean;
  time_posted: Date;
  stack: any;
  username: string;
  post_id: number;
  id: number;
  owner_id: number;
}

const SHOW = "SHOW";
const CONFIRM = "CONFIRM";
const SAVING = "SAVING";
const EDITING = "EDITING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function PostListItem(props: IProps) {
  const [value, setValue] = React.useState("");
  const [error, setError] = useState("");
  const { mode, transition, back } = useVisualMode(SHOW);

  function onEdit() {
    transition(EDITING);
  }

  function onSaveEdit() {
    transition(SHOW);
  }

  const stack = props.post.stack.map((tech_stack, index) => {
    return (
      <li className="list" key={index}>
        {tech_stack}&nbsp;
      </li>
    );
  });

  const postComments = props.comments.filter((comment) => {
    if (typeof props.post === 'undefined' || typeof comment === 'undefined') return null;
    if (props.post.post_id === comment.post_id) {
      return true;
    }
  });

  const postLikes = props.likes.filter(
    (like) => props.post.post_id === like.post_id
  );

  const likeSum = postLikes.length;



  function onDelete() {
    props.deletePost(props.post.post_id);
    // transition(EDITING);
  }

  return (
    <>
      <ContextConsumer>
        {({ data }) => {
          if (!data.state) return null;
          if (!data.selected) return null;
          const currentUser = props.users.find(
            (user) => user.id === data.selected
          );

          const myLikes = postLikes.filter(
            (like) => currentUser.id === like.liker_id
          );

          const iAlreadyLikeThis = myLikes.length > 0;
          
          const commentList = postComments.map((comment, index) => {

          const myComment = currentUser.id === comment.commenter_id;

          const myCommentOrPost = currentUser.id === comment.commenter_id || currentUser.id === props.post.owner_id;
            
          const onRemove = () => {
            //check for empty input here
            props.removeComment(props.post.post_id, currentUser.id, comment.id);
          };

          return (
            <div className="dashboard">


            <div className="content-inner" key={index}>
              <img
                className="comment-avatar"
                src={comment.avatar}
                alt="avatar"
              />
              <div className="comments">
              <Link className="user-link" to={`/user-profiles/${comment.username}`}>
                  <span className="comment-username">
                    <b>{comment.username}&nbsp;&nbsp;</b>
                  </span>
                </Link>
                <span>{comment.text_body}</span>
                  {/* {myCommentOrPost ? (
                    <p onClick={() => onEdit()} className={deleteButton}>
                      Edit
                    </p>
                  ) : (
                    ""
                  )} */}
                  {myCommentOrPost ? (
                    <span onClick={() => onRemove()} className="delete-button">
                      Remove Comment
                    </span>
                  ) : (
                    ""
                  )}
                </div>
            </div>
            </div>
          );
        });
          
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
            if (value !== ""){
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

          // const onEdit = () => {
          //   //check for empty input here
          //   props.editComment(props.comment.post_id, currentUser.id, value, props.comment.text_body);
          // };

          const timeAgo = timeSince(props.post.time_posted);

          const myPost = currentUser.id === props.post.owner_id ;

          return (
            <div>
              <Card>
              <div className="dashboard">

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
                    user={currentUser}
                    updatePost={props.updatePost}
                    onSaveEdit={onSaveEdit}
                  />
                  )}
                  {/* POST STACK LIST */}
                  <h5 className="stack"> {stack}</h5>

                  <div className="wrap-collapsible">

                    <input 
                      id={"collapsible" + props.index} className="toggle"  
                      type="checkbox">
                    </input>

                    <label htmlFor={"collapsible" + props.index} className="lbl-toggle">
                    {/* COMMENTS LIST FOR POST */}

                    {commentsLength > 1 ? <span>{commentsLength} comments</span> : ""}

                    {commentsLength === 1 ? <span>{commentsLength} comment</span> : ""}

                    </label>
                    <div className="collapsible-content">{commentList}
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
                    
                    <div className="comment-like-button-flex">
                      <div className="comment-button button-transition"onClick={() => onValidateComment()}>Comment</div>
                    </div>
                    <div>
                      <section className="validation">{error}</section>
                    </div>
                    
                  </div>
                  {/* BUTTON FOR LIKES */}
                  <div className="likes">
                    {iAlreadyLikeThis ? (
                      <FontAwesomeIcon 
                      onClick={() => props.removeLike(props.post.post_id, currentUser.id)}
                      className="unlove"
                      icon={fasHeart} size="1x" />
                    ) : (                  
                      <FontAwesomeIcon 
                        onClick={() => props.addLike(props.post.post_id, currentUser.id)}
                        className="love"
                        icon={farHeart} size="1x" />
                    )}

                    <div className="likes-comments">
                      {/* LIKE COUNT */}

                      {iAlreadyLikeThis && likeSum > 1 ? 
                        <p onClick={() => props.removeLike(props.post.post_id, currentUser.id)}>
                        <b>You and {likeSum - 1} others</b></p> : ""}

                      {!iAlreadyLikeThis && likeSum > 1 ? 
                        <p onClick={() => props.addLike(props.post.post_id, currentUser.id)}>
                        <b>{likeSum}  likes</b></p> : ""}

                      {iAlreadyLikeThis && likeSum === 1 ? 
                        <p                       onClick={() => props.removeLike(props.post.post_id, currentUser.id)}>
                        <b>You like this</b></p> : ""}

                      {!iAlreadyLikeThis && likeSum === 1 ? 
                      <p onClick={() => props.addLike(props.post.post_id, currentUser.id)}><b>{likeSum} like</b></p> : ""}
                      
                    </div>
                  </div>

                  </div>
                </CardBody>
                </div>
              </Card>
            </div>
          );
        }}
      </ContextConsumer>
    </>
  );
}
