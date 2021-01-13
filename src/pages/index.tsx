import React from "react";
import Row from "@paljs/ui/Row";
import PostList from "../components/Posts/PostList";
import Editor from "../components/Posts/Editor";
import useApplicationData from "../hooks/useApplicationData";
import ContextConsumer from "../context/context";
import NewLogin from '../components/LoginLogout/NewLogin'
import { getDashboardPosts } from "../helpers/profileHelpers";
import './dashboard.scss'

import { Router } from "@reach/router";

import "./dashboard.scss";
import { Route } from "react-router-dom";
interface IProps {
  value: object;
  submitPost: (username: string) => void;
  username: "string";
  onChange: void;
  users: IUsers;
  onSaveEdit;
  updatePost: (
    editedPost: string,
    post_id: number,
    id: number
  ) => void;
}

interface IUsers {
  [index: number]: { id: number; user_id: number; name: string };
}

export default function Home(index) {
  const {
    state,
    createPost,
    addLike,
    createComment,
    removeLike,
    removeComment,
    editComment,
    filterDashboardPosts,
    deletePost,
    updatePost,
  } = useApplicationData();

  let dashPosts = getDashboardPosts(state.posts);
  // const filterOptions = getFilterOptions(state.posts);

  // useEffect(() => {
  //   setOptions(filterOptions);
  // }, []);
  function filterPost(filter) {
    // if (filter !== "") {
    filterDashboardPosts(filter);
    // dashPosts = getDashboardPosts(state.filtered_posts);
    //}
  }
  // dashPosts = state.filtered_posts;
  // console.log("dashposts in dash: ", dashPosts);
  const comments = state.comments;
  const likes = state.likes;
  const users = state.users;
  return (
    <ContextConsumer>
      {({ data }) => {
        if (!data.state && !data.selected) return <NewLogin></NewLogin>;
        return (
          <div className="dashboard-page">
            <div className="App">
              <div className="hero">
                {" "}
                <h1 className="title">Build a better dev community.</h1>
                <p>Ask for help or be a mentor.</p>
              </div>

              <Editor
                createPost={createPost}
                suggestion={state.stack_preferences}
                users={users}
              />
              <div className="container">
                <div className="post-filter">
                  <div
                    className="filter-btn filter-btn-all"
                    onClick={() => filterPost("")}
                  >
                    All
                  </div>
                  <div
                    className="filter-btn filter-btn-css"
                    onClick={() => filterPost("CSS")}
                  >
                    CSS
                  </div>

                  <div
                    className="filter-btn filter-btn-ruby"
                    onClick={() => filterPost("Ruby")}
                  >
                    Ruby
                  </div>
                  <div
                    className="filter-btn filter-btn-javascript"
                    onClick={() => filterPost("Javascript")}
                  >
                    Javascript
                  </div>
                </div>
                <PostList
                  users={users}
                  posts={dashPosts}
                  comments={comments}
                  likes={likes}
                  addLike={addLike}
                  removeLike={removeLike}
                  createComment={createComment}
                  removeComment={removeComment}
                  editComment={editComment}
                  deletePost={deletePost}
                  updatePost={updatePost}
                />
              </div>
            </div>
          </div>
        );
      }}
    </ContextConsumer>
  );
}
