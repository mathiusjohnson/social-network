import React, {useState} from "react";
import './NewComment.scss'


export default function CommentForm(props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
    
    const commentObj = {
      avatar: props.currentUser.avatar,
      username: props.currentUser.username,
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
          props.currentUser.id,
          value,
          commentObj)
          .then(() => {
        setValue("");
        });         
      }
    }

  return (
    <>
      <div className="new-comment">
        <div className="center-textarea">
          <textarea 
            className="comment-textarea"
            value={value}
            onChange={(event) => {setValue(event.target.value);}} 
            rows="2" placeholder="Leave a comment here.."
          ></textarea>
        </div>

        <div>
          <section className="validation">{error}</section>
        </div>
        <div className="comment-like-button-flex">
          <div className="comment-button button-transition"onClick={() => onValidateComment()}>Comment</div>
        </div>
      </div>
    </>
  );
}
