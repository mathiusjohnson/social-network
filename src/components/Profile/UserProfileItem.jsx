import React from "react";
import { Card, CardBody } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import Editor from "./Editor";
import PostList from "./PostList";
import UserInfo from "./UserInfo";
import EditUserInfo from "./EditUserInfo";

import ContextConsumer from "../../context/context";
import { getUser, getUserPosts, getStack } from "../../helpers/profileHelpers";

import useVisualMode from "../../hooks/useVisualMode";
import useApplicationData from "../../hooks/useApplicationData";

import "../../styles/profile.css";

const SHOW = "SHOW";
const CONFIRM = "CONFIRM";
const SAVING = "SAVING";
const EDITING = "EDITING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

function UserProfileItem(props) {
  const {
    state,
    createPost,
    updateUserInfo,
    updateMentorStack,
    createComment,
    updatePost,
    deletePost,
  } = useApplicationData();
  const { mode, transition, back } = useVisualMode(SHOW);
  const loggedUser = typeof document !== 'undefined' && document.cookie.split("=")[1];
  let senderID = typeof document !== 'undefined' && document.cookie.split("=")[1];

  function onEdit() {
    transition(EDITING);
  }

  function onSave() {
    transition(SHOW);
  }

  function onCancel() {
    back();
  }

  console.log(state.users);
  let currentUser = state.users.find(
    (user) => user.id === props.userId || user.username === props.userId
  );
  // console.log("current user after prof item: ", props.userId);
  return (
    <>
      <ContextConsumer>
        {({ data, set }) => {
          if (!data.state) return null;
          if (!data.selected) return null;
          console.log("data in context: ", data.state.users);

          if (!currentUser) {
            currentUser = state.users.find((user) => user.id === data.selected);
            console.log("current user in context: ", currentUser);
          }

          if (!currentUser) {
            return null;
          }

          if (
            currentUser.id ||
            currentUser.student_id ||
            currentUser.mentor_id
          ) {
            senderID = currentUser;
          }
          const comments = state.comments;

          const posts = getUserPosts(state.posts, senderID.id);

          const user = getUser(state.user_profiles, senderID.id);

          const mentor = data.state.mentor_points.find(
            (mentor) => mentor.id === user.id
          );

          const student = data.state.student_points.find(
            (student) => student.id === user.id
          );

          const mentor_stack = getStack(state.mentor_stack, senderID.id);

          return (
            <Row className="user-profile">
              <Col breakPoint={{ xs: 12 }}>
                {/* <header>Profile</header> */}

                {mode === SHOW && (
                  <>
                    {console.log("after reducer", state.users[0])}
                    <UserInfo
                      user={currentUser}
                      loggedInUser={data.selected}
                      onEdit={onEdit}
                      mentor_stack={mentor_stack}
                    />
                  </>
                )}
                {mode === EDITING && (
                  <>
                    <EditUserInfo
                      user={currentUser}
                      loggedInUser={data.selected}
                      mentor_stack={mentor_stack}
                      suggestion={state.stack_preferences}
                      avatars={state.avatars}
                      onSaveNewInfo={updateUserInfo}
                      onSaveNewStack={updateMentorStack}
                      onSave={onSave}
                      onCancel={onCancel}
                    />
                  </>
                )}
                {currentUser.id === parseInt(loggedUser, 10) ? (
                  <Row>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Editor
                        id={user.id}
                        createPost={createPost}
                        suggestion={state.stack_preferences}
                      />
                    </Col>
                  </Row>
                ) : (
                    ""
                  )}
                <Row>
                  <Col breakPoint={{ xs: 12, md: 12 }}>
                    <h2>Recent Posts...</h2>
                  </Col>
                </Row>
                <PostList
                  user={currentUser}
                  comments={comments}
                  posts={posts}
                  users={state.users}
                  createComment={createComment}
                  updatePost={updatePost}
                  deletePost={deletePost}
                />
              </Col>
            </Row>
          );
        }}
      </ContextConsumer>
    </>
  );
}

export default UserProfileItem;
