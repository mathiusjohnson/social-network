import React from "react";
import PostListItem from "./PostListItem";

interface IProps {
  comments: IComments;
  posts: IPosts;
  likes: ILikes;
  addLike: (post_id: number, liker_id: number) => void;
  removeLike: (post_id: number, liker_id: number) => void;
  users: IUsers;
  createComment: (
    post_id: number,
    commenter_id: number,
    text_body: string
  ) => void;
  removeComment: (
    post_id: number,
    commenter_id: number,
    text_body: string
  ) => void;
  editComment: (
    post_id: number,
    commenter_id: number,
    text_body: string
  ) => void;
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
  [index: number]: { id: number; user_id: number; name: string };
}

interface IPosts {
  [index: number]: { id: number; user_id: number; name: string };
}

interface ILikes {
  [index: number]: { id: number; user_id: number; name: string };
}

export default function PostList(props: IProps) {
  const comments = props.comments;
  const likes = props.likes;
  props.posts.sort(function(a, b) {
    let dateA = new Date(a.time_posted), dateB = new Date(b.time_posted)
    return dateB-dateA
  })
  
  const postData = props.posts.map((post, index) => {
    return (
      <PostListItem
        index={index}
        key={index}
        post={post}
        comments={comments}
        likes={likes}
        addLike={props.addLike}
        removeLike={props.removeLike}
        createComment={props.createComment}
        removeComment={props.removeComment}
        editComment={props.editComment}
        users={props.users}
        deletePost={props.deletePost}
        updatePost={props.updatePost}
      />
    );
  });
  
  return (
    <div>
      <section>
        <h1>Feed</h1>
        <ul>{postData}</ul>
      </section>
    </div>
  );
}
