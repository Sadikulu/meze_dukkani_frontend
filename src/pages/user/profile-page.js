import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import Profile from "../../components/user/profile/profile";
import UserTemplate from "../../templates/user-template";

const ProfilePage = () => {
  return (
    <UserTemplate>
      <PageHeader title="Profil" />
      <Spacer />
      <Profile />
      <Spacer />
    </UserTemplate>
  );
};

export default ProfilePage;
