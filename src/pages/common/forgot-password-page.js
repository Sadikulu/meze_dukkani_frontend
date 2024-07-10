import React from "react";
import AnonymousTemplate from "../../templates/anonymous-template";
import Spacer from "../../components/common/spacer/spacer";
import PageHeader from "../../components/anonymous/page-header/page-header";
import ForgotPassword from "../../components/common/auth/forgot-password";

const ForgotPasswordPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="Şifremi Unuttum" />
      <Spacer />
      <ForgotPassword />
      <Spacer />
    </AnonymousTemplate>
  );
};

export default ForgotPasswordPage;
