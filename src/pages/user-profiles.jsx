import React from "react";
import { Router } from "@reach/router";
import UserProfileItem from "./profile-components/UserProfileItem";

function Profile(props) {
  return (
    <Router>
      <UserProfileItem path="user-profiles/" />
      <UserProfileItem path="user-profiles/:userId" />
    </Router>
  );
}

export default Profile;