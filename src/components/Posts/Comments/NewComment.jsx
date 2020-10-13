import React, {useState} from "react";
import '../PostListItem.scss'
export default function CommentForm(props) {
  const [value, setValue] = useState("Comment here...");
  // const [error, setError] = useState("");

  const onSave = () => {
    //check for empty input here
    console.log("props post id: ", props.post.post_id);
    
    const commentObj = {
      avatar: props.currentUser.avatar,
      username: props.currentUser.username,
    };

    if (value === "") {
      props.setError("Comment cannot be blank");
      return;
    }

    if (value !== ""){
      props.setError("");
      props.createComment(
        props.post.post_id,                 
        props.currentUser.id,
        value,
        commentObj)
        .then(() => {
      setValue("");
      });     
  };

  return (
    <>
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
          <div className="comment-button button-transition"onClick={() => onSave()}>Comment</div>
        </div>
      </>
    );
  }
}