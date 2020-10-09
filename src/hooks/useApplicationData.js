import { useReducer, useEffect } from "react";
import { getStack, makeStackObj } from "../helpers/profileHelpers";
import axios from "axios";
import reducer, {
  SET_POINTS,
  SET_APPLICATION_DATA,
  SET_SELECTED_USER,
  SET_POSTS,
  SET_NEW_STACK,
  SET_NEW_INFO,
  SET_LIKES,
  ADD_COMMENT,
  REMOVE_LIKE,
  REMOVE_COMMENT,
  EDIT_COMMENT,
  ADD_TO_STACK,
  REMOVE_FROM_STACK,
  EDIT_POST,
  DELETE_POST,
  FILTER_POSTS,
  FETCH_POSTS,
} from "../reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    comments: {},
    likes: [],
    mentor_stack: [],
    points: 0,
    posts: [],
    student_stack: [],
    tutor_experiences: [],
    user_profiles: [],
    users: [],
    mentor_points: [],
    student_points: [],
    stack_preferences: [],
    posts_stacks: [],
    avatars: [],
    selected: {},
    filtered_posts: [],
  });

  // RETRIEVES API AND SETS IT WITH REDUCER
  useEffect(() => {
    Promise.all([
      axios.get("https://stack-network.herokuapp.com/api/comments"),
      axios.get("https://stack-network.herokuapp.com/api/likes"),
      axios.get("https://stack-network.herokuapp.com/api/mentor_stack"),
      axios.get("https://stack-network.herokuapp.com/api/posts"),
      axios.get("https://stack-network.herokuapp.com/api/student_stack"),
      axios.get("https://stack-network.herokuapp.com/api/tutor_experiences"),
      axios.get("https://stack-network.herokuapp.com/api/user_profiles"),
      axios.get("https://stack-network.herokuapp.com/api/users"),
      axios.get("https://stack-network.herokuapp.com/api/mentor_points"),
      axios.get("https://stack-network.herokuapp.com/api/student_points"),
      axios.get("https://stack-network.herokuapp.com/api/stack_preferences"),
      axios.get("https://stack-network.herokuapp.com/api/posts_stacks"),
      axios.get("https://stack-network.herokuapp.com/api/register/avatars"),
      axios.get("https://stack-network.herokuapp.com/api/posts"),
    ]).then((all) => {
      // console.log("all from applicatin data hook: ", all);
      const comments = all[0].data;
      const likes = all[1].data;
      const mentor_stack = all[2].data;
      const posts = all[3].data;
      const student_stack = all[4].data;
      const tutor_experiences = all[5].data;
      const user_profiles = all[6].data;
      const users = all[7].data;
      const mentor_points = all[8].data;
      const student_points = all[9].data;
      const stack_preferences = all[10].data;
      const posts_stacks = all[11].data;
      const avatars = all[12].data;
      const selected = {};
      const filtered_posts = all[13].data;
      dispatch({
        type: SET_APPLICATION_DATA,
        comments,
        likes,
        mentor_stack,
        posts,
        student_stack,
        tutor_experiences,
        user_profiles,
        users,
        mentor_points,
        student_points,
        stack_preferences,
        posts_stacks,
        avatars,
        selected,
        filtered_posts,
      });
    });
  }, []);

  // FOR WEBSOCKET
  // useEffect(() => {
  //   const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  //   socket.onopen = () => socket.send("ping");
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === SET_POINTS) {
  //       dispatch(data);
  //     }
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  const setSelectedUser = (userID) => {
    dispatch({
      type: SET_SELECTED_USER,
      userId: userID,
    });
  };

  const createPost = (postDetails, techStack, id) => {
    console.log("post details: ", techStack);
    const newPost = {
      text_body: postDetails.text,
      active: true,
      owner_id: id,
      stack: [],
      time_posted: new Date().toISOString(),
      is_mentor: false,
      is_student: true,
      avatar: postDetails.avatar,
      username: postDetails.username,
    };
    console.log("newpost in hooked: ", newPost);
    if (!postDetails.mentor) {
      (newPost["is_mentor"] = true), (newPost["is_student"] = false);
    }
    for (let entry of techStack) {
      // console.log("stack name in hook", entry.name);
      newPost["stack"].push(entry.name);
    }

    const promise = axios
      .post(`https://stack-network.herokuapp.com/api/posts`, { newPost })
      .then((response) => {
        console.log("response.data in first .then", response.data);
        getNewPostId(response.data);

        dispatch({
          type: SET_POSTS,
          data: newPost,
        });
      });
    const getNewPostId = (res) => {
      console.log(res.id);
      Promise.all(
        techStack.map((element) => {
          axios.post(`https://stack-network.herokuapp.com/api/posts_stacks`, {
            post_id: res.id,
            stack_id: element.id,
          });
        })
      ).then(
        axios.spread(function(...res) {
          // all requests are now complete
          console.log("success");
        })
      );
    };
    return promise;
  };

  const addLike = (postId, likerId) => {
    console.log("like data in hook: ", postId, likerId);
    const newLike = {
      post_id: postId,
      liker_id: likerId,
    };
    const promise = axios
      .post(`https://stack-network.herokuapp.com/api/likes`, { newLike })
      .then((response) => {
        console.log("response in likes hook: ", response);
        dispatch({
          type: SET_LIKES,
          data: newLike,
        });
      })
      .catch((error) => {
        console.log("I don't *like* this mess", error);
      });
    return promise;
  };

  const removeLike = (postId, unlikerId) => {
    console.log("unlike data in hook: ", postId, unlikerId);
    const removeLike = {
      post_id: postId,
      liker_id: unlikerId,
    };
    const promise = axios
      .delete(`https://stack-network.herokuapp.com/api/likes`, {
        params: { removeLike: removeLike },
      })
      .then((response) => {
        console.log("response in likes hook: ", response);
        dispatch({
          type: REMOVE_LIKE,
          data: removeLike,
        });
      })
      .catch((error) => {
        console.log("I don't *like* this mess", error);
      });
    return promise;
  };

  const createComment = (postId, commenterId, commentDetails, commentObj) => {
    console.log(" data in comment hook: ", postId, commenterId, commentDetails);
    const newComment = {
      post_id: postId,
      commenter_id: commenterId,
      text_body: commentDetails,
      avatar: commentObj.avatar,
      username: commentObj.username,
    };
    console.log("new comment in hook: ", newComment);

    const promise = axios
      .post(`https://stack-network.herokuapp.com/api/comments`, { newComment })
      .then((response) => {
        console.log("response.data in first .then", response.data[0]);
        dispatch({
          type: ADD_COMMENT,
          data: newComment,
        });
      })
      .catch((err) => {
        console.log("I don't *comment* this mess", err);
      });

    return promise;
  };

  const editComment = (postId, commenterId, commentDetails, oldTextBody) => {
    console.log(" data in comment hook: ", postId, commenterId, commentDetails);
    const updatedComment = {
      post_id: postId,
      commenter_id: commenterId,
      text_body: commentDetails,
      value: oldTextBody,
    };
    console.log("new comment in hook: ", updatedComment);

    const promise = axios
      .put(`https://stack-network.herokuapp.com/api/comments`, { updatedComment })
      .then((response) => {
        console.log("response.data in first .then", response.data[0]);
        dispatch({
          type: EDIT_COMMENT,
          data: updatedComment,
        });
      })
      .catch((err) => {
        console.log("I don't *comment* this mess", err);
      });
    return promise;
  };
  const updatePost = (editedPost, post_id, id) => {
    console.log("from hook", editedPost, post_id, id);

    const promise = axios
      .put(`https://stack-network.herokuapp.com/api/posts`, {
        text_body: editedPost,
        post_id: post_id,
      })
      .then((response) => {
        // console.log("response.data in first .then", response.data[0]);
        dispatch({
          type: EDIT_POST,
          text: editedPost,
          post_id: post_id,
        });
      })
      .catch((err) => {
        console.log("I don't *comment* this mess", err);
      });

    return promise;
  };

  const updateUserInfo = (newInfo, id) => {
    console.log(
      "here in update",
      state.user_profiles,
      state.mentor_stack,
      newInfo
    );

    const promise = Promise.all([
      axios.put("https://stack-network.herokuapp.com/api/users/edit", {
        id: id,
        username: newInfo["username"],
      }),
      axios.put("https://stack-network.herokuapp.com/api/user_profiles/edit", {
        id: id,
        avatar: newInfo["avatar"],
        location: newInfo["location"],
      }),
    ])
      .then(
        dispatch({
          type: SET_NEW_INFO,
          data: newInfo,
          id: id,
        })
      )
      .catch((err) => console.log("something went wrong in the update"));
  };

  const deletePost = (post_id) => {
    console.log("here in delete", post_id);

    const promise = axios
      .delete(`https://stack-network.herokuapp.com/api/posts`, { params: { post_id } })
      .then((response) => {
        // console.log("response.data in first .then", response.data[0]);
        dispatch({
          type: DELETE_POST,
          post_id: post_id,
        });
      })
      .catch((err) => {
        console.log("I don't *delete* this mess", err);
      });

    return promise;
  };

  const updateMentorStack = (removed, added, id) => {
    const arrOfRemoved = makeStackObj(removed, id);
    const arrOfAdded = makeStackObj(added, id);

    if (arrOfRemoved.length !== 0) {
      axios
        .all(
          arrOfRemoved.map((element) => {
            axios.delete(`https://stack-network.herokuapp.com/api/mentor_stack`, {
              params: element,
            });
          })
        )
        .then(
          dispatch({
            type: REMOVE_FROM_STACK,
            removed: arrOfRemoved,
          })
        );
    }

    if (arrOfAdded.length !== 0) {
      axios
        .all(
          arrOfAdded.map((element) => {
            axios.post(`https://stack-network.herokuapp.com/api/mentor_stack`, element);
          })
        )
        .then(
          dispatch({
            type: ADD_TO_STACK,
            added: arrOfAdded,
          })
        );
    }
  };

  const removeComment = (postId, commenterId) => {
    console.log("unlike data in hook: ", postId, commenterId);
    const removeComment = {
      post_id: postId,
      commenter_id: commenterId,
    };
    const promise = axios
      .delete(`https://stack-network.herokuapp.com/api/comments`, {
        params: { removeComment: removeComment },
      })
      .then((response) => {
        console.log("response in likes hook: ", response);
        dispatch({
          type: REMOVE_COMMENT,
          data: removeComment,
        });
      })
      .catch((error) => {
        console.log("I don't *like* this mess", error);
      });
    return promise;
  };
  const filterDashboardPosts = (filter) => {
    console.log("from filter", filter);

    dispatch({
      type: FILTER_POSTS,
      text: filter,
    });
  };

  return {
    state,
    createPost,
    setSelectedUser,
    updateUserInfo,
    updateMentorStack,
    addLike,
    createComment,
    removeLike,
    removeComment,
    editComment,
    updatePost,
    deletePost,
    filterDashboardPosts,
  };
}
