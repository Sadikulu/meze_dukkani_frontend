import React from "react";
import AnonymousTemplate from "../../templates/anonymous-template";
import Spacer from "../../components/common/spacer/spacer";
import PageHeader from "../../components/anonymous/page-header/page-header";
import ForgotReset from "../../components/common/auth/forgot-reset";

const ForgotResetPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader />
      <Spacer />
      <ForgotReset />
      <Spacer />
    </AnonymousTemplate>
  );
};

export default ForgotResetPage;
