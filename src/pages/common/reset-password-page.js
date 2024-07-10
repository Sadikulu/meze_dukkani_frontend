import React from "react";
import AnonymousTemplate from "../../templates/anonymous-template";
import Spacer from "../../components/common/spacer/spacer";
import PageHeader from "../../components/anonymous/page-header/page-header";
import ResetPassword from "../../components/common/auth/reset-password";

const ResetPasswordPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="Şifre Sıfırlama" />
      <Spacer />
      <ResetPassword />
      <Spacer />
    </AnonymousTemplate>
  );
};

export default ResetPasswordPage;
