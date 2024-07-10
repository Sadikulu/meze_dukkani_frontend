import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import UserTemplate from "../../templates/user-template";
import Account from "../../components/user/profile/account";

const AccountPage = () => {
  return (
    <UserTemplate>
      <PageHeader title="Hesap" />
      <Spacer />
      <Account />
      <Spacer />
    </UserTemplate>
  );
};

export default AccountPage;
